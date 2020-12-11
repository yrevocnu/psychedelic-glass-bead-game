## Development

1. [Install node via nvm](https://github.com/nvm-sh/nvm)
1. [Install Yarn](https://classic.yarnpkg.com/en/docs/install)
1. [Install Mongo Community Edition](https://docs.mongodb.com/manual/installation/)
1. Move `.env-sample` to `.env` and replace `DISCORD_TOKEN` (ask @benheller)
1. `nvm install` <-- select node version
1. `yarn install` <-- install deps
1.  E.g. `sudo service mongod start` if running mongo locally
1. `yarn seed:db` <-- seed db
1. `yarn debug` <-- run app

## Contributing
1. Run `yarn eslint .` prior to committing code and address all enumerated issues.
1. Commits should be squashed and rebased when merging PRs. No merge commits.
1. PRs are encouraged and require 1 approval to merge.

## Commands

1. `!new` <-- starts new PGBG session
1. `!draw` <-- lists decks
1. `!draw {{deck}}` <-- draws a card in a deck

## MongoDB

1. There are scripts for reseeding the database. Be careful not to do this with the production DB! (even if you have the .env for it)
1. You will need to have the MongoDB running locally if you want to seed it, with something like
```
sudo service mongod start
```

## Cards

The card data is is `assets/decks`.

There is a `.csv` file for each deck with all the card data with its spellings.

The directories contain the images of the cards. (Referenced by the decl `.csv` files)
