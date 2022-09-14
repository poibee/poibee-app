# Poimania App

## Environment
```nvm use --delete-prefix v16.16.0```
```ionic``` ==> CLI 6.20.1

## Start Ionic local server
```ionic serve```
```http://localhost:8100```

## Start Angular local server
```npm run start```
```http://localhost:4200```

## Tests ausführen
```npm run test```

## E2E-Tests ausführen
```npm run e2e```

## Docker
```npm run build:prod```
```docker build -t poibee-app .```
```docker images```
```docker run -p 55560:80 -d --name my-poibee-app poibee-app```

## Generate components

ng g service services/PoisOverpass
ng g page pages/discover
ng g component pages/discover/components/discover-list
