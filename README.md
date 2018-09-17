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

## How to run
- Go to each lambda folder and run (having aws already setuped)

```
  serverless deploy
```

- FE is an static site

## Futures Improvements
- Add security, anyone with access to the API could change results, etc.
- Different endpoints for sign up and sign in, I did both on the same endpoint because I wanted to avoid creating separate pages on the FE.
- More validation (fields like x, y, bombs doesn't have any validation).
- There is a bug with the user-game endpoint, the query is not working properly.
- Of course finishing the game functionality and some CSS work. 
- Probably some code refactor, less than 5 hours deadline is HARD. 
