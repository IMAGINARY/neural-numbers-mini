# pug-asset-manifest

Given a JSON manifest file that maps canonical asset names to their full filename (including the
hash added by the bundler or compiler), it generates a function that can be used in a Pug template
to generate the correct URL for an asset.

Usage

```
!= asset('path/to/asset.ext')
```

example:

```
script(src!= asset('assets/js/bundle.js'))
```

will turn into

```
<script src='assets/js/bundle.af88d72b7d9.js'></script>
```

