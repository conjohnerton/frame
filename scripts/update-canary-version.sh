#!/bin/bash
echo "NEW_VERSION=$(grep -o '[[:digit:]].[[:digit:]].[[:digit:]]-canary.[[:digit:]]' package.json | awk -F. '{$NF = $NF + 1;} 1' OFS=.)" >> $GITHUB_OUTPUT
sed -i "s/[[:digit:]].[[:digit:]].[[:digit:]]-canary.[[:digit:]]/${{ steps.update-version.outputs.NEW_VERSION }}/" package.json
