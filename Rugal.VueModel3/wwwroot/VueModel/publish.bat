
del /Q "src\esm"
del /Q "src\types"
del /Q "src\umd"
del /Q "dist"

dotnet build ../../

copy src\esm\VueModel.js dist\VueModel.esm.js
copy src\umd\VueModel.js dist\VueModel.umd.js

echo "publish start"
npm publish
echo "publish finish"

pause
