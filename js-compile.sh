#!/bin/bash

java -jar ~/dev/google-compiler/closure-compiler-v20190325.jar \
    --js_output_file=public/bin/panta.js \
    --language_in=ECMASCRIPT6 \
    --formatting=PRETTY_PRINT \
    --formatting=print_input_delimiter \
    'public/js/view/**.js' \
    'public/js/services/**.js' \
    'public/js/contracts/**.js' \
    'public/js/components/**.js' \
    'public/js/controllers/**.js' \
    'public/js/admin/domain/AbstractField.js' \
    'public/js/admin/**.js' \
    'public/js/models/**.js' \
    'public/js/helpers/**.js'
