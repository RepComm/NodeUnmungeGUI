TODO: Write thorough readme after stable standalone build.

Working prototype!

Usage as of this prototype:

Run using electron (not Attach To Chrome) from VSCode (binary build later)
Click on the file drop box (dragging files not implemented yet) and the file chooser opens.
Select some LVL files to decompile/unmunge
Change input/output settings as desired (instructions link soon)
Hit 'GO' to run unmunge process
Bottom left box is a log from swbf-unmunge.exe

Non-lvl files will not be processed, but can still appear in the file list (will remove later)
Click on a file to remove it from the list
Duplicate files will not be detected, this will change in the future

No error checking is done on files or their selection, this will change
Current commit is largely untested and not meant for production. Use at your own risk.