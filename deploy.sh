git checkout gh-pages
git merge master -m "merge"
ng build --prod  --baseHref="https://9marioandres6.github.io/SCRWM/"
cp 404.html docs/
git add docs
git commit -am "build"
git push
git checkout master
