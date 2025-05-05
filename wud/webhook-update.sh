#!/bin/bash

if [ -z "$image_tag_value" -o -z "$update_kind_local_value" -o -z "$image_name" ]; then
  echo "Is wud okay?"
  exit 1
fi

curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_BEARER_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  $GITHUB_WOKFLOW_URL \
  -d '{"ref":"main","inputs":{"remote_tag":"'$image_tag_value'","local_tag":"'$update_kind_local_value'","image_name":"'$image_name'"}}'