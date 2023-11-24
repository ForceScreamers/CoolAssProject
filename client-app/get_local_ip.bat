for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a
set LOCAL_IP=%NetworkIP% 
powershell "echo ${env:LOCAL_IP}"