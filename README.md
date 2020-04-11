## Development

1. [Install node via nvm](https://github.com/nvm-sh/nvm)
1. [Install Yarn](https://classic.yarnpkg.com/en/docs/install)
1. [Install Mongo Community Edition](https://docs.mongodb.com/manual/installation/)
1. Move `.env-sample` to `.env` and replace `TOKEN` (ask @benheller)
1. `nvm use` <-- select node version
1. `yarn install` <-- install deps
1. `yarn seed:db` <-- seed db
1. `yarn debug` <-- run app

## Commands

1. `!new` <-- starts new PGBG session
1. `!draw` <-- lists decks
1. `!draw {{deck}}` <-- draws a card in a deck

## Web
1. `cd web`
1. `yarn dev`