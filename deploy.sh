git add .
git commit -am "deploy"
git push
ssh mal 'cd /var/www/themarsvoyage.interzonas.info; git pull'

