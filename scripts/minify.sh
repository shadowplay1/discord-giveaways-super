#!/bin/bash

compiled_source_dir="./dist"

get_compiled_files() {
    dir_path="$1"
    compiled_files=()

    while IFS= read -r -d $'\0' file; do
        if [[ "$file" == *.js ]]; then
            compiled_files+=("$file")
        fi
    done < <(find "$dir_path" -type f -name "*.js" -print0)

    echo "${compiled_files[@]}"
}

minify_file() {
    file_path="$1"
    minified_code=$(terser "$file_path" --compress --mangle)

    echo "$minified_code" > "$file_path"
    echo "Successfully minified $file_path"
}

compiled_files=($(get_compiled_files $compiled_source_dir))

for js_file in "${compiled_files[@]}"; do
    minify_file "$js_file"
done
