const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI3OWIyNmM5ZGUwZDY5NDZlODY1NGNjNWNlYWQ2ZDE5NGQ2MDFjOTNjMTlkOWFiMDEyZGIwYjViOTk2ZjkzYzU3NTQzYTcwODQ4MjJiMzM3ZiIsImlhdCI6MTc2NzA1ODg3My43NTk4MywibmJmIjoxNzY3MDU4ODczLjc1OTgzMywiZXhwIjoyMDgyNTkxNjczLjc0NTQ2MSwic3ViIjoiNjIyNjQ1MSIsInNjb3BlcyI6W119.ngcfBgE_-pLAQrEMYbRwfRqmt3pshhUTAUSS4Kkxxzv-8jL_4rBvLJYE5yO0MX0R1nBxrEOG290No0HmPm6O1WUDc7Ejes3_AQ2otiZsWVQiDiNyOWY5HjJluYHWdqeBAMSFCCe6Vo2dRJFsQdXuTsWhCBw5hf3WbM6ELqTjezk1OAEeHgHrpw9n8iHJxpXXcyZL-bCtjqMi0yPaP6sXsEFisPZgr9l9L03f-Ooh7pvyVPCQAZcnqFPryYA6BlG_mkXiO5QIaAdYSzR6SEsta94jCDc64J6LBucB4mp3DzKsabx0ZTASBndX-Yvle41yXD-HOOT0LxDg3yZgvz3wqvJlTkgwYQ8c2Z3i012UxdYaSk5cwFUvoVo4hpV9wfx7FxDNa4m5tdmlJimwxggV5rrwmm2OSv6ue5E8-a2m8V-nd_dsy3Eoujns4o6hRTcOdri2HBk4HiDwKBSIRrniDMCMF1MQJb7HXQ0UHBcSOjj-JqZ3g9CIAndi9O4wos4XVyPaVEMpYn7XqjXMZuefRf_KE3_OfQoLloY8b_ou1KEDRqteiwjl2zuUy4_Y21tRKTfoMMiP-BDGpvXmxBF4BmWwJ2dsFRO3bohQ3Bsw4-oIlBXLpVCfqvc3xQxXhHV-LBciTeOaxPzR4hdzoMaQQ17GGai3pUpnoVHonTsMw-o';

async function getStoreId() {
    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/stores', {
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
}

getStoreId();
