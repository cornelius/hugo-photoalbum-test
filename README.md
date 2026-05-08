This is a test photo album for [Hugo](https://gohugo.io) generated photo albums using the theme [hugo-photoalbum-theme](https://github.com/cornelius/hugo-photoalbum-theme).

You need to install Hugo (`brew install hugo`) and [Go](https://go.dev/doc/install).

Run

    hugo server

and follow the instructions there to show the album.

## Updating the theme

After pushing changes to [hugo-photoalbum-theme](https://github.com/cornelius/hugo-photoalbum-theme), pull the new version into this repo with:

    hugo mod get -u
    hugo mod tidy

This rewrites `go.mod` and `go.sum` to point at the latest commit on each direct dependency's default branch. Rebuild with `hugo` to pick up the new layouts.
