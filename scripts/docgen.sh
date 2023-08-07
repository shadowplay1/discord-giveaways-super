#!/bin/bash

package_content="$(< ./package.json)"
package_version="$(jq -r '.version' <<< "${package_content}")"

source_pattern="src/* src/**/* src/**/*/*"
output_path="./docs/generated/${package_version}.json"

customPath="./docs/index.yml"
js_config_path="./jsconfig.json"

mkdir docs/generated > /dev/null 2>&1

docgen -s ${source_pattern} -o ${output_path} -c ${customPath} -g -S 1 -j ${js_config_path}
