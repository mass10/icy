@ECHO BUILD
@CALL yarn tsc
@ECHO BUILD END
@ECHO COPY
@COPY dist\main.js C:\inetpub\wwwroot\tt-ui\
@ECHO COPY END
