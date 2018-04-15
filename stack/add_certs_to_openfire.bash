#!/bin/bash

export PASS="changeit"


header() {
    echo -e "\n\033[1m"
    echo "$1"
    echo "====================================================================="
    echo -e -n "\033[0m"
}


if [ "$UID" == "" ]; then
  UID=`id -u`
fi

alias keytool="docker run -i --entrypoint keytool --volume ./:/mnt/ --workdir /mnt --user $UID openjdk:8-jdk-alpine"

deletealiasfrom() {
  keytool -delete -keystore $2 -storepass "${PASS}" -alias "$1" || echo "Note: There was no key named '$1' in '$2'."
}

header "Import CA in client.truststore"
deletealiasfrom "testca" openfire/conf/security/client.truststore
keytool -importcert -storepass "${PASS}" -keystore openfire/conf/security/client.truststore -alias testca -file certs/keys/ca-fullchain.pem


header "Convert host certificate"
openssl pkcs12 -export -in certs/keys/host/openfire/fullchain.pem -inkey certs/keys/host/openfire/privkey.pem\
  -out certs/keys/host/openfire/full.p12 -name "openfire" -passout "pass:${PASS}"\
  -CAfile certs/keys/ca-fullchain.pem -caname root && echo "Success!"


header "Clean out old host certificates"
for name in openfire openfire_rsa openfire_dsa rsa dsa; do
  deletealiasfrom "$name" openfire/conf/security/keystore
done


header "Import new host certificates"
keytool -importkeystore -deststorepass "${PASS}" \
  -destkeypass "${PASS}" -destkeystore openfire/conf/security/keystore\
  -srckeystore certs/keys/host/openfire/full.p12 -srcstoretype PKCS12 -srcstorepass "${PASS}"\
  -alias openfire
