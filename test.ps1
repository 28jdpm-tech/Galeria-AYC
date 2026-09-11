 = Get-Content 'js\app.js';
 = 0;  = 0;
for ( = 0;  -lt .Length; ++) {
     = [];
     += (.ToCharArray() | Where-Object { $_.ToString() -eq '{' }).Count;
     += (.ToCharArray() | Where-Object { $_.ToString() -eq '}' }).Count;
    if ( -  -eq 0 -and  -gt 0) {
        # Scope closed
    }
}
Write-Host "Done"
