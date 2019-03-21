## Run in development
```
  docker-compose up
```

## Run in production
```
  docker-compose -f docker-compose.prod.yml up
```

## Setup after run
```
  docker-compose exec api yarn --cwd ./barberTurn install
  docker-compose exec ui yarn --cwd ./barberTurn install
```

# Run in production without docker

## Config mongo
  ```
    sudo service mongod start
  ```

## Config nginx
  * Copy server/defalut.conf to /etc/nginx/sites-enabled/default
  ```
    sudo vim /etc/nginx/sites-enabled/default
    sudo /etc/init.d/nginx start
  ```

## Config api
  * Copy .env-api to server api folder as .env
  * Run service
  ```
    sudo yarn
    sudo yarn start-prod > ./api.log 2>&1 &
  ```
  * Watch api logs
  ```
    tail -f -n 1000 api.log
  ```
  * Stop api
  ```
    lsof -i :3000
    kill PROCESS_PID
  ```
  * Drop mongo
  ```
    mongo
    use alpha22
    db.db.Dropdatabase()
  ```


## Config ui
  * Copy .env-ui to server ui folder as .env
  * Run service
  ```
    sudo yarn
    sudo yarn start-prod
  ```
  * Move ./build to /var/www/html
  ```
    sudo mv build/* /var/www/html/
  ```
