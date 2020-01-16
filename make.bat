@SETLOCAL
@ECHO OFF

DEL /Q dist\*

CALL yarn tsc

IF EXIST ".setting.bat" (
	CALL .setting.bat
)

ECHO END
