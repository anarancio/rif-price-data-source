# How to start the service

1. Run ``` npm install ```
2. Create file .env (found and example in .env.example)
3. run ``` pm2 start index.js ```

# Docker

Create `.env` file as in step 2 of previous section. Then, run

```
$ sudo docker build -t rif-price-data-source .
$ sudo docker run --init -d -p 3000:3000 rif-price-data-source
```

Make sure that the port number used in `-p 3000:3000` matches the one
in your `.env` file
