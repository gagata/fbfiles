function getGroups() {
    FB.api('/me?fields=id,name,updated_time,groups.icon_size(34){id,name,icon,updated_time}', function(response) {
        console.log(response);

        gdict = localStorage.getItem("groups");
        if (!gdict) {
            gdict = {}
        } else {
            gdict = JSON.parse(gdict);
        }
        var groups = response.groups.data;
        for(var i=0; i<groups.length; i++){
            var group = groups[i];
            if(!gdict[group['id']]){
                gdict[group['id']] = { 'name':group['name'], 'lastUpdate':group['updated_time'],
                    'icon':group['icon'], 'starred':false }
            }
        }
        console.log(gdict);
        console.log(JSON.stringify(gdict))
        localStorage.setItem("groups", JSON.stringify(gdict));

        console.log(response.groups.data);
        present_folders(response.groups.data);
        return response;
    });
}
