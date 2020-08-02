git checkout gh-pages
git merge master
ng build --prod  --baseHref="https://9marioandres6.github.io/SCRWM/"
git add docs
git commit -am "build"
git push
git checkout master
