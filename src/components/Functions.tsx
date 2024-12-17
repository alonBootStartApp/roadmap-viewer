export const getDevelopersList = ({item}) => {
    let developers = [];
    if(item.isBackend){
        developers.push('Backend');
    }
    if(item.isFrontend){
        developers.push('Frontend');
    }
    if(item.isAutomation){
        developers.push('Automation');
    }
    if(item.isDevops){
        developers.push('DevOps');
    }
    if(item.isCyber){
        developers.push('Cyber');
    }
    return developers.join(', ');
}