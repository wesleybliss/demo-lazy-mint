
# lazymintdemo

> VITE + REACT + TAILWIND CSS BOILERPLATE

A minimal React starter kit, including:

- Vite for faster builds
- Normal `process.env` vars (no need for `VITE_` prefix)
- React Router v6
- Tailwind CSS
- PostCSS with some typical plugins
- [React Wire](https://github.com/forminator/react-wire) for the best state management experience
- [React Wire Persisted](https://github.com/wesleybliss/react-wire-persisted) for persisting state to `localStorage`
- [React Icons](https://github.com/react-icons/react-icons) for easy icon imports


## Caveats

1. Vite has made the annoying choice to require all JSX files have the `.jsx` extension, so `.js` files will not be transpiled as JSX. There is a workaround for this, but it could result in breaking changes, and is not recommended.
2. There are some common helper functions in `lib/utils.js` which can be deleted if not needed
3. Production builds should be good for small projects, but little effort has gone towards fine tuning, and could be improved

## Setup

Clone the project

```shell
$ git clone https://github.com/wesleybliss/vite-base app && cd $_
```

Run the setup script _(optional)_

- Replaces all instances of the title ("Vite Base")
- Replaces all instances of the slug ("vite-base")
- Deletes & re-initializes Git
- Deletes itself (the `setup.sh` script)

```shell
$ ./setup.sh app-slug 'App Name'
```

Install dependencies & start the dev server

```shell
$ yarn
$ yarn dev
```


## License

[MIT](https://choosealicense.com/licenses/mit/)
