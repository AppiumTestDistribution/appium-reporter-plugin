cd src/web
npm install
npm run build
cd ..
rm -f bundle.js
cp ./web/dist/bundle.js ./reportTemplate/bundle.js