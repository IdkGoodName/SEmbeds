const [editorUtil, formValidations] = await Promise.all([
    require("guilded/reguilded-util/editor"),
    require("guilded/components/formValidations")
]);

if (!editorUtil) console.warn("SEmbeds cannot function without given permission.");

// In-case Guilded changes something
const validations =
    typeof formValidations === "object" && typeof formValidations.default === "function" ? formValidations.default : {};

const embedModal = {
    header: "Add Embed",
    confirmText: "Create",
    shouldIgnoreUnsavedChanges: true,
    formSpecs: {
        sectionStyle: "border-unpadded",
        sections: [
            {
                fieldSpecs: [
                    {
                        type: "Text",
                        fieldName: "title",
                        label: "Title",
                        isOptional: true
                    },
                    {
                        type: "Text",
                        fieldName: "url",
                        label: "URL",
                        validationFunction: validations.ValidateIsUrl,
                        isOptional: true
                    },
                    {
                        type: "Color",
                        fieldName: "color",
                        label: "Colour",
                        defaultValue: "#f5c400",
                        isOptional: true,

                        size: "xsm",
                        useLightColors: true
                    },
                    {
                        type: "TextArea",
                        fieldName: "description",
                        placeholder: "Description (with markdown)",
                        isOptional: true
                    }
                ]
            },
            {
                name: "author",
                header: "Author",
                isCollapsible: true,
                fieldSpecs: [
                    {
                        type: "Text",
                        fieldName: "author_name",
                        label: "Author name",
                        isOptional: true
                    },
                    {
                        type: "Image",
                        fieldName: "author_iconUrl",
                        isOptional: true,
                        label: "Icon",
                        defaultValue: "/asset/Default/Gil-md.png?v=1",

                        displayFormat: "Small",
                        instructions: "It is recommended to use square image at least 32x32 pixels in size",
                        minWidth: 50,
                        maxWidth: 50,
                        aspectRatio: 1,
                        showColoredUploadButton: true,
                        buttonLabel: "Upload author icon",

                        dynamicMediaTypeId: "WebhookAuthor",
                        friendlyUploadName: "author icon"
                    },
                    {
                        type: "Text",
                        fieldName: "author_url",
                        label: "Author URL",
                        validationFunction: validations.ValidateIsUrl,
                        isOptional: true
                    }
                ]
            },
            {
                header: "Images",
                isCollapsible: true,
                fieldSpecs: [
                    {
                        type: "Image",
                        fieldName: "thumbnail",
                        isOptional: true,
                        label: "Thumbnail",
                        defaultValue: "/asset/Default/Gil-md.png?v=1",

                        displayFormat: "Medium",
                        instructions: "It is recommended to use square image at least 80x80 pixels in size",
                        minWidth: 80,
                        maxWidth: 80,
                        aspectRatio: 1,
                        showColoredUploadButton: true,
                        buttonLabel: "Upload thumbnail",

                        dynamicMediaTypeId: "WebhookThumbnail",
                        friendlyUploadName: "embed thumbnail"
                    },
                    {
                        type: "Image",
                        fieldName: "image",
                        isOptional: true,
                        label: "Image",
                        defaultValue: "/asset/Default/Gil-md.png?v=1",

                        instructions: "Any size for the image is available",
                        maxWidth: 400,
                        aspectRatio: 3,
                        resizeMode: "cover",
                        fullWidthImage: true,
                        showColoredUploadButton: true,
                        buttonLabel: "Upload embed image",
                        imageStyle: "position-centered",

                        dynamicMediaTypeId: "WebhookPrimaryMedia",
                        friendlyUploadName: "embed image"
                    }
                ]
            },
            {
                name: "footer",
                header: "Footer",
                isCollapsible: true,
                fieldSpecs: [
                    {
                        type: "Text",
                        fieldName: "footer_text",
                        label: "Footer text",
                        isOptional: true
                    },
                    {
                        type: "Image",
                        fieldName: "footer_iconUrl",
                        label: "Icon",
                        isOptional: true,
                        defaultValue: "/asset/Default/Gil-md.png?v=1",

                        displayFormat: "Small",
                        instructions: "It is recommended to use square image at least 32x32 pixels in size",
                        minWidth: 50,
                        maxWidth: 50,
                        aspectRatio: 1,
                        imageStyle: "rounded",
                        showColoredUploadButton: true,
                        buttonLabel: "Upload footer icon",

                        dynamicMediaTypeId: "WebhookFooter",
                        friendlyUploadName: "footer icon"
                    },
                    {
                        type: "Switch",
                        fieldName: "enableTimestamp",
                        label: "Enable timestamp",
                        description:
                            "Since date fields always have a value by default, this must be turned on to add a timestamp.",
                        isOptional: true
                    },
                    {
                        type: "Date",
                        fieldName: "datestamp",
                        rowCollapseId: "footerTimestamp",
                        grow: 0,
                        isOptional: true,

                        allowPastValues: true
                    },
                    {
                        type: "Time",
                        fieldName: "timestamp",
                        rowCollapseId: "footerTimestamp",
                        grow: 0,
                        isOptional: true,

                        showInlineTimezone: false
                    }
                ]
            },
            {
                name: "fields",
                header: "Fields",
                isCollapsible: true,
                fieldSpecs: [
                    {
                        type: "TextArea",
                        fieldName: "fields",
                        isOptional: true,
                        label: "Field JSON",
                        placeholder: `[ { "name": "Field title", "value": "Field description" }, { "name": "Inline field", "value": "This is an inline field", "inline": true } ]`,
                        validationFunction(value) {
                            /** @type {Array<{ name: string, value: string, inline?: boolean }>} */
                            let json;
                            // Syntax checking
                            try {
                                json = JSON.parse(value);
                            } catch (e) {
                                return "Invalid JSON syntax";
                            }

                            if (!Array.isArray(json)) return "Field JSON must contain array";

                            // Make sure it's { name: string, value: string, inline?: boolean }
                            if (
                                json.some(
                                    x =>
                                        typeof x !== "object" ||
                                        typeof x.name !== "string" ||
                                        typeof x.value !== "string" ||
                                        (typeof x.inline !== "boolean" && typeof x.inline !== "undefined")
                                )
                            )
                                return "Invalid field's type or type of its properties";
                        },
                        description:
                            "Fields form is temporarily a text area that takes in JSON array. To set the title of the field, set 'name' property and to write its description, set 'value' field. If you need it to be inline, set 'inline' field as 'true' without quotes of any kind. Make sure to learn how to use JSON before using this."
                    }
                ]
            }
        ]
    }
};

async function onEmbedClick({ editor, overlayProvider }) {
    const { confirmed, changedValues, isValid, hasChanged } = await overlayProvider.SimpleFormOverlay.Open(embedModal);
    // You can still get around it by setting colour
    if (confirmed && isValid && hasChanged) {
        const {
            title,
            url,
            color,
            description,
            footer_text,
            footer_iconUrl,
            datestamp,
            timestamp,
            enableTimestamp,
            author_name,
            author_iconUrl,
            author_url,
            image,
            thumbnail,
            fields
        } = changedValues;

        // Because field values are weird
        const embed = {
            title,
            url,
            description,
            color: color && parseInt(color.slice(1), 16),
            image: image && {
                url: image
            },
            thumbnail: thumbnail && {
                url: thumbnail
            },
            footer: footer_text && {
                text: footer_text,
                iconUrl: footer_iconUrl
            },
            timestamp: enableTimestamp && datestamp.add(timestamp, "s"),
            author: author_name && {
                name: author_name,
                iconUrl: author_iconUrl,
                url: author_url
            },
            fields: fields && JSON.parse(fields)
        };

        // Insert it where the caret is at
        editor.insertBlock({
            object: "block",
            type: "webhookMessage",
            data: {
                // TODO: Send multiple embeds
                embeds: [embed]
            },
            nodes: []
        });
    }
}
module.exports = {
    insertPluginAction: {
        name: "Embed",
        actions: [
            {
                action: "blockInsert",
                label: "Embed",
                bodyText: "Adds a customizable embed.",
                icon: "icon-description",
                sectionType: "rows",
                onAction: onEmbedClick
            }
        ]
    },
    // ReGuilded
    init() {},
    load() {
        const embedPlugin = editorUtil.getPluginByType("webhookMessage");
        // Webhook messages/embeds have no toolbar info by default
        embedPlugin.toolbarInfo = {
            iconGroup: "embeds",
            iconName: "icon-description",
            tooltip: "Custom embed",
            onClick: onEmbedClick,
            menu: {
                size: "lg",
                menuSpecs: { id: "CustomEmbed", sections: [this.insertPluginAction] }
            }
        };
        this.insertedIndex = editorUtil.addInsertPlugin(embedPlugin);
        // Add it to whatever chat it has opened
        editorUtil.addSlateSection(this.insertPluginAction);
    },
    unload() {
        if (typeof this.insertedIndex === "number") editorUtil.removeInsertPlugin(this.insertedIndex);
        editorUtil.removeSlateSection(this.insertPluginAction.name);
    }
};
