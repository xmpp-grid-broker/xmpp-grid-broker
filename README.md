# XMPP-Grid Broker

[![Build Status](https://travis-ci.org/xmpp-grid-broker/xmpp-grid-broker.svg?branch=master)](https://travis-ci.org/xmpp-grid-broker/xmpp-grid-broker)


The XMPP-Grid Broker is an client web application to simplify the management of an [XMPP-Grid](https://tools.ietf.org/id/draft-ietf-mile-xmpp-grid-05.html) 

## Developer Information

### Install dependencies

This application requires at least Node.js 6.9.0 and NPM 3. Run `npm install` to get all dependencies.

### Development Stack

Requirements to run the Stack:
- [docker](https://docker.com/)
- Linux or macOS

To start the test stack, run:
```bash
export UID
docker-compose up
```

The development stack consists of three components: A openfire XMPP server, node server with application server, and a nginx server to proxy both.

Following services are provided:

| Service | URL | Authentication |
| --- | --- | --- |
| XMPP-Grid Broker with auto-reload on changes | https://xgb.localhost.redbackup.org/ | TLS client certificate (see below) |
| Openfire BOSH | https://xgb.localhost.redbackup.org/http-bind/ | TLS client certificate (see below) |
| Openfire WebSocket | https://xgb.localhost.redbackup.org/ws/ | TLS client certificate (see below) |
| Openfire administration interface | https://openfire-admin.localhost.redbackup.org/ | Username: `admin`, Password: `1q2w3e4r` |

`*.localhost.redbackup.org` is an alias for `127.0.0.1`; if you want to work offline, simply add that to your `/etc/hosts` file.

#### TLS Certificates and Test Users

All TLS server and client certificates as well as the according test-CA are provided in `stack/certs/`. 

To authenticate to the XMPP-Grid Broker, you can add the according client-certificate to your browser beforehand:

| JID | Password | Certificate |
| --- | --- | --- |
| eva@openfire | 123456 | `stack/certs/keys/client/eva@openfire/eva@openfire.p12` |
| _admin_ | _1q2w3e4r_ | - |


#### Generate new Certificates

If you want to generate a new CA and certificates (which is probably a good idea), execute the following steps:
```bash
# Requires openssl binary and bash.
cd stack/certs/
rm -r keys/
./generate.bash
```

(Note that if you want to directly connect to the Openfire XMPP server, you also have to update its CA and host-certificates trough the administration interface; also see next section.)

#### Edit Openfire Configuration

To edit the Openfire Configuration (e.g. for adding new users or TLS certificates), you have to execute following steps:

```bash
export UID
docker-compose -f docker-compose.openfire-admin.yml -f docker-compose.yml up

# clean up access permissions after finishing
sudo chown -R $UID stack/openfire
```

### Code scaffolding

Run `npm run ng generate component component-name` to generate a new component. You can also use `npm run ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `npm run ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `npm run ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `npm run ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
