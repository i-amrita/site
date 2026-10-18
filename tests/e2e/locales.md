# Locales

State: `?locale=en|ms|hi|de|ml`. English is the default; other locales switch on as intl-ai translations land.

## Flows

- `/?locale=de` renders German strings and sets `<html lang="de">`.
- An invalid locale (`?locale=xx`) falls back to English.
- `Alt+L` cycles locales and writes `locale` to the URL.
