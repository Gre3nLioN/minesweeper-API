# minesweeper-API
Minesweeper game

## Time spend
- API + Client library 4:30 hs
- FE + game functionallity 2hs (still pending game functionallity)

## Workflow
### BE
- Design Data schemas
- Decide architecture
- Code lambdas
- Alter serverless.yml files
- Deploy and test

### FE
- Code each lambda function implementation
- Use API library by the game library
- Code Game functionallity

- Write README + Deploy github page

## Why lambdas
I wanted to test a full serverless application and I thought this was a good opportinity to try it. Also, I didn't want to setup an ec2 instance + codeDeploy, which requires time didn't have. 

## Why github pages
Easy to setup, fast and simple, no hosting required.

# How to run
- Go to each lambda folder and run (having aws already setuped)

```
  serverless deploy
```

- FE is an static site
