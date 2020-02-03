@REM ##########################################################################
@REM test command for Windows
@REM ##########################################################################
@SETLOCAL
@ECHO OFF

DEL /S /Q dist\*

CALL yarn tsc

REM CALL yarn browserify --entry dist/src/icy.js --require requirejs

IF EXIST ".setting.bat" (
	CALL .setting.bat
)

ECHO END
