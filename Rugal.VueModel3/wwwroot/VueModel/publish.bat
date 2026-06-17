
dotnet build ../../

copy src\VueModel.js dist\VueModel.esm.js

del "src\VueModel.js"
del "src\VueModel.js.map"

echo publish start
call npm publish
echo publish finish

pause