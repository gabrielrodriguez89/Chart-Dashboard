$(function () {
    Vue.component("ckeditor", {
        props: {
            value: String,
            opts: String || Object,
            id: String
        },
        data: function () {
            return {
                ckeditorId: "",
                editorId: "",
                content: "",
                uploadUrl: "/Media/UploadFromCkEditor?container=kpi-dashboard-images",
                container: "kpi-dashboard",
                attachId: "chart-attachment-",
                height: 330,
                filter: null,
                showEditor: false,
                instance: null,
                attachment: null,
                showAttachment: false,
                attachmentName: "",
                isAdmin: true,
                options: null,
                orginalEditorValue: ""
            };
        },
        template:
            '<div class="ck-editor">'
            + '<div class="btn-group-inline chart-btn-group-footer" v-if="isAdmin">'
            + '<button v-show="!showEditor && !showAttachment" @click="toggleEditor" class="port-chart-button pull-right" data-toggle="tooltip" data-placement="bottom" title="Open Editor">'
            + '<span class="glyphicon glyphicon-edit" ></span>'
            + '</button>'
            + ' <div>'
            + ' <button v-show="showEditor" @click="saveEditorContent" class="port-chart-button text-success pull-right" data-toggle="tooltip" data-placement="bottom" title="Save Changes">'
            + '<span class="glyphicon glyphicon-check" ></span>'
            + '</button>'
            + ' <button v-show="showEditor" @click="cancel" class="port-chart-button text-danger pull-right" data-toggle="tooltip" data-placement="bottom" title="Cancel Changes">'
            + '<span class="glyphicon glyphicon-remove" ></span>'
            + '</button>'
            + ' <button v-show="showEditor" @click="clear" class="port-chart-button text-danger pull-right" data-toggle="tooltip" data-placement="bottom" title="Clear Editor">'
            + '<span class="glyphicon glyphicon-erase" ></span>'
            + '</button>'
            + '</div>'
            + '</div>'
            + '<div class="sub-content">'
            + '<p v-show="!showEditor" v-html="content"></p>'
            + '</div>'
            + '<div v-show="showEditor" class="editor">'
            + '<textarea :id=\'ckeditorId\' class="form-control" name="editor" ref="editorId" >{{ content }}</textarea>'
            + '</div>'
            + '</div>',
        methods: {
            toggleEditor: function () {
                var self = this;
                var boolCheck = self.showEditor;

                if (boolCheck) {
                    self.showEditor = false;
                    self.$emit("hide-content", false);
                }
                else {
                    self.showEditor = true;
                    self.$emit("hide-content", true);
                }
            }, // manually open azure explorer
            initVariables: function () {
                var self = this;
                var stamp = new Date().valueOf();

                self.originalEditorValue = self.value || "";
                self.ckeditorId = "ckeditor-" + stamp;
                self.attachment = "";
                self.content = self.value || "";
            }, // initialize
            initAzure: function () {
                var self = this;

                $(self.$refs.azureId).AzureStoragePicker({
                    pickerOpenButtonElement: $(self.$refs.btnId),
                    okButtonText: "Select",
                    defaultContainer: self.container,
                    title: "Choose File",
                    upload: true,
                    singlePick: true,
                    rootAccess: false,
                    selected: function (event, data) {
                        if (data.blobs.length) {
                            self.updateAttachment(data.blobs[0].url, data.blobs[0].name);
                        }
                    }
                });
            },
            saveEditorContent: function () {
                var self = this;

                self.originalEditorValue = self.content;
                self.toggleEditor();
            },
            cancel: function () {
                var self = this;
                if (self.content === self.value) {
                    self.toggleEditor();

                    return;
                }
                self.content = self.originalEditorValue;
                self.$emit("input", self.originalEditorValue);
                CKEDITOR.instances[self.ckeditorId].setData(' ');
                self.toggleEditor();
                
            },
            clear: function () {
                var self = this;

                self.content = "";
                self.$emit("input", self.content);
                self.instance.setData("");
                self.originalEditorValue = "";
                self.toggleEditor();
            }
        },
        created: function () {
            var self = this;

            self.initVariables();

            self.options = 
                {
                    customConfig: self.opts,
                    imageUploadUrl: self.uploadUrl,
                    azureBlobContainer: self.container,
                    height: self.height,
                    pasteFilter: self.filter,
                    on: {
                        change: function () {
                            var val = self.instance.getData();
                            self.content = val;
                            self.$emit("input", val);
                        }
                    }
                }
        },
        mounted: function () {
            var self = this;

            self.instance = CKEDITOR.replace(self.$refs.editorId, self.options);

            self.initAzure();
        },
        watch: {
            value: {
                handler: function (newVal) {
                    if (newVal !== this.content) {
                        this.instance.setData(newVal);
                    }
                }
            }
        }
    });
});