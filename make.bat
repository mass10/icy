@SETLOCAL
@ECHO OFF

CALL yarn tsc

IF EXIST ".setting.bat" (
	CALL .setting.bat
)
