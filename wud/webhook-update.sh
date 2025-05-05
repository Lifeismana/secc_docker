#!/bin/bash

if [ -z "$result_tag" -o -z "$image_tag_value" -o -z "$image_name" ]; then
  echo "Is wud okay?"
  exit 1
fi

#if result_tag & image_tag_value are the same, then we need to update the image

if [ "$result_tag" != "$image_tag_value" ]; then
  curl -s -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_BEARER_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    $GITHUB_WOKFLOW_URL \
    -d '{"ref":"main","inputs":{"remote_tag":"'$result_tag'","local_tag":"'$image_tag_value'","image_name":"'$image_name'"}}'
else
  echo "No update needed, tags are the same."
fi