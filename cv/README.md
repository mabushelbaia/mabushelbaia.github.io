# CV (LaTeX source)

- `main.tex` — CV content
- `developercv.cls` — document class used by `main.tex`

## Build

```sh
pdflatex main.tex
```

This produces `main.pdf`. Copy it to the repo root as `mabushelbaia_cv.pdf`
(the file the site links to):

```sh
cp main.pdf ../mabushelbaia_cv.pdf
```

Auxiliary build files (`*.aux`, `*.log`, `main.pdf`, …) are gitignored.
