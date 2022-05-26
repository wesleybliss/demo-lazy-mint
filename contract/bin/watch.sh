#!/bin/zsh

DIR="$1"

echo "Watching directory for changes:"
echo "$DIR"

# Do an initial test run when watch is called
find ./test -name '*.test.js' | xargs npx truffle test

inotifywait -e close_write,moved_to,create -r -m "$DIR" |

while read -r directory events filename; do
    if [[ "$filename" == *".sol"* ]] ||
        [[ "$filename" == *".test.js"* ]] ||
        [[ "$directory" == *"test"* ]] ||
        [[ "$directory" == *"migrations"* ]]; then
        clear
        echo "Changed: $filename"
        
        # if [[ "$filename" == *".js"* ]]; then
        #     find ./test -name '*.test.js' | xargs npx truffle test --compile-none
        # else
        #     find ./test -name '*.test.js' | xargs npx truffle test
        # fi
        find ./test -name '*.test.js' | xargs npx truffle test
        
    fi
done
