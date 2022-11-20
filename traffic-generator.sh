#!/bin/bash -x
echo "Press [CTRL+C] to stop.."

while :
do
    end=`shuf -i 1-10000 -n 1`
    curl -XPOST -H "Content-Type: application/json" http://localhost:8080/start --data "{\"from\": 1, \"to\": ${end}}"
done
