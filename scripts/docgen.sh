source_pattern="src/* src/**/*"
output_path="./docs/generated/${package_version}.json"

customPath="./docs/index.yml"
js_config_path="./jsconfig.json"

docgen -s ${source_pattern} -o ${output_path} -c ${customPath} -g -S 1 -j ${js_config_path}
