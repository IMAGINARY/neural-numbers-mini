# neural-numbers-mini

Portable version of Neural Numbers for use as a suitcase exhibit

## Sentry

This project uses [Sentry](https://sentry.io) to track errors in production.

Unhandled exceptions and console messages (error and warn) will be sent if the Sentry DSN is set. 

The Sentry DSN will be read from:
- The `sentry-dsn` query string argument. (Read from the browser)
- The `sentryDSN` key in config.json. (Read at build-time only)
- The `SENTRY_DSN` environment variable. (Read at build-time only)

To enable Sentry, set the `SENTRY_DSN` environment variable to your Sentry DSN.

## Credits

Adapted by [Eric Londaits](https://github.com/elondaits) 
from the [Neural Numbers](https://github.com/IMAGINARY/neural-numbers)
exhibit created by [Aaron Montag](https://github.com/montaga) for IMAGINARY gGmbH.

## License

Copyright 2019-2022 IMAGINARY gGmbH.
Licensed under the MIT License (see LICENSE).
