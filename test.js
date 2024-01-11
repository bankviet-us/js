   $(document).ready(function() {
            // Change the name of the button when a file is selected
            $('.custom-file-input').on('change', function() {
                // Get the file name
                var fileName = $(this).val().split('\\').pop();
                // Update the label
                $(this).next('.custom-file-label').html(fileName);
            });

            // Make the 'ABC' button click the file input when clicked
            $('#imageUploadAddon').on('click', function() {
                $('#imageUpload').click();
            });
        });

        var $modal = $('#modal');
        var image = document.getElementById('image');
        var icon_path_default_error = document.getElementById('icon_path_default_error');
        var cropper;
        $("body").on("change", ".id_front_image", function(e) {
            var fileName = document.getElementById('fileName');

            var files = e.target.files;
            if (files && files.length > 0) {
                var file = files[0];

                if (file.type === "image/heic" || file.name.endsWith('.heic')) {
                    icon_path_default_error.innerHTML = ''
                    heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.8
                        })
                        .then(function(jpegBlob) {
                            handleFile(jpegBlob);
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                } else if(file.type.match('image.*')) {
                    handleFile(file);
                    icon_path_default_error.innerHTML = ''
                }
                else {
                    console.log(1232)
                    var htmlToAdd = '<span class="invalid-feedback" style="display:flex !important"> <strong>ファイル形式が無効です。有効なファイル形式は、PNG または JPG です。</strong></span>';
                    icon_path_default_error.innerHTML += htmlToAdd;
                }
                fileName.textContent = files[0].name;
            }
            e.target.value = '';
        });

        function handleFile(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                image.src = e.target.result;
                $modal.modal('show');
            };
            reader.readAsDataURL(file);
        }

        $modal.on('shown.bs.modal', function() {
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                viewMode: 1,
                preview: '.preview',
                zoomOnWheel: true,
                cropBoxResizable: false,
                dragMode: 'none',
            });
        }).on('hidden.bs.modal', function() {
            cropper.destroy();
            cropper = null;
        });

        $("#crop").click(function() {
            $('#clearButton').show();
            canvas = cropper.getCroppedCanvas({
                width: 512,
                height: 512,
            });

            canvas.toBlob(function(blob) {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    var base64data = reader.result;
                    $("input[name='icon_path']").val(base64data);
                }
                url = URL.createObjectURL(blob);
                $('#imagePreview').attr('src', url).show();
                $modal.modal('hide');
            }, 'image/jpeg');
        });

    // confirm delete image
    $(document).ready(function() {
            $('#confirmDeleteModal').on('show.bs.modal', function(e) {
                //handle submit form
                $('#confirmDeleteBtn').click(function() {
        $('#fileName').text('');

        $('#imagePreview').attr('src', '').hide();
        $("input[name='icon_path']").val('');
        $('#confirmDeleteModal').modal('hide');
        $('#clearButton').hide();
                });
            });
        });
