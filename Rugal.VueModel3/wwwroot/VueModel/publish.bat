
del /Q "src\esm"
del /Q "src\umd"
del /Q "dist"

dotnet build ../../

copy src\esm\VueModel.js dist\VueModel.esm.js
copy src\umd\VueModel.js dist\VueModel.umd.js

del "src\VueModel.js"
del "src\VueModel.js.map"

echo publish start
call npm publish
echo publish finish

pause