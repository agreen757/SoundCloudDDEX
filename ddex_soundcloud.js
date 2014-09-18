var fs = require('graceful-fs');
var async = require('async');
var sourceName = process.argv[2]+".csv"
var fileName = process.argv[2]+".xml";
var date = new Date().toISOString();
//console.log(date)
var uuid = require('node-uuid');
var GUID = uuid.v1();
var csv = require('ya-csv');
var hash = require('hash_file');
var silo = [];
var counter = 0;
var mainCounter = 0;
var md5 = require('md5');
var checksum = require('checksum');
var rightNow = new Date();
var res = rightNow.toISOString().slice(0,10);
//var crypto = require('crypto');

fs.appendFileSync(fileName, '<?xml version="1.0" encoding="UTF-8"?>\n');
fs.appendFileSync(fileName, '<ern:NewReleaseMessage MessageSchemaVersionId="ern/34" LanguageAndScriptCode="en" xs:schemaLocation="http://ddex.net/xml/ern/34 http://ddex.net/xml/ern/34/release-notification.xsd" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xmlns:ern="http://ddex.net/xml/ern/34">\n');
fs.appendFileSync(fileName, '<MessageHeader>\n');
fs.appendFileSync(fileName, '<MessageThreadId>'+res+'IND</MessageThreadId>')
fs.appendFileSync(fileName, '<MessageId>'+GUID+'</MessageId>\n');
fs.appendFileSync(fileName, '<MessageSender>\n');
fs.appendFileSync(fileName, '<PartyId>PADPIDA2014040303H</PartyId>\n');
fs.appendFileSync(fileName, '<PartyName>\n');
fs.appendFileSync(fileName, '<FullName>INDMUSIC</FullName>\n');
fs.appendFileSync(fileName, '</PartyName>\n');
fs.appendFileSync(fileName, '</MessageSender>\n');
fs.appendFileSync(fileName, '<MessageRecipient>\n');
fs.appendFileSync(fileName, '<PartyId>PADPIDA20121010037</PartyId>\n');
fs.appendFileSync(fileName, '<PartyName>\n');
fs.appendFileSync(fileName, '<FullName>SoundCloud</FullName>\n');
fs.appendFileSync(fileName, '</PartyName>\n');
fs.appendFileSync(fileName, '</MessageRecipient>\n');
fs.appendFileSync(fileName, '<MessageCreatedDateTime>'+date+'</MessageCreatedDateTime>\n');
fs.appendFileSync(fileName, '<MessageControlType>LiveMessage</MessageControlType>\n');
fs.appendFileSync(fileName, '</MessageHeader>\n');
fs.appendFileSync(fileName, '<UpdateIndicator>OriginalMessage</UpdateIndicator>');
fs.appendFileSync(fileName, '<ResourceList>\n');

var reader = csv.createCsvFileReader(sourceName, {columnsFromHeader:true,'separator': ','});



async.series([
    
    function(callback){
        pusher(callback);  
    },
    
    function(callback){
        soundRecording(callback);
    },
    
    function(callback){
        image(callback);
    },
    
    function(callback){
        endResource(callback);
    }, 
    
    function(callback){
        releaseList(callback);
    },
    
    function(callback){
        dealList(callback);
    }, 
    
    function(callback){
        ender(callback);
    }
])

//*************-------FUNCTIONS----------*************

function pusher(callback){
    reader.addListener('data', function(data){
        if(data['Resource Type'] != ''){
            var propper = data['CustomID'].toUpperCase();
            var duration = data['Song Length'].split('-');
            var duration2 = "PT"+duration[0]+"H"+duration[1]+"M"+duration[2]+"S"
            var date = data['Release Date'].split('/');
            //var date2 = date[0]
            var year = data['C Line Year'];
            if(date[0] < 10){
                var month = '0'+date[0];
            }
            else{
                var month = date[0];
            }
            if(date[1] < 10){
                var day = '0'+date[1];
            }
            else{
                var day = date[1];
            }
            var date3 = year+"-"+month+"-"+day;
            var date2 = data['C Line Year']+"-0"+date[0]+"-"+date[1];
            silo.push({resourceType:data['Resource Type'], isrc:data['ISRC'], proprietaryId:propper, resourceReference:data['ResourceReference'], referenceTitle:data['Song Title'].replace('&',' and '), duration:duration2, fullName:data['Artist'].replace('&',' and '), labelName:data['Label'], plineYear:data['P Line Year'], plineText:data['P Line'], genreText:data['Genre'].replace(/[ ]/g,'').replace('&','/'), subGenre:data['SubGenre'], parentalWarningType:data['Parental Warning?'], technicalResourceDetailsReference:data['TechnicalResourceDetailsReference'], fileName:data['File Name'], filePath:"resources/", hashSum:data['HashSum'], icpn:parseFloat(data['UPC']), albumTitle:data['Album'].replace('&',' and '), clineYear:data['C Line Year'], clineText:data['C Line'], releaseReference:data['ReleaseReference'], releaseDate:date3, territory:data['Territory']})
    }
    })
    
    reader.addListener('end', function(){
        console.log("end of pusher");
        callback()
    })
}

function ender(callback){
    console.log("at end");
    fs.appendFileSync(fileName, '</DealList>\n</ern:NewReleaseMessage>')
}

function dealList(callback){
    counter = 0;
    fs.appendFileSync(fileName, '</ReleaseList>\n');
    fs.appendFileSync(fileName, '<DealList>\n');
    silo.map(function(element){
        //if(element.resourceType == "SoundRecording"){
            //counter++
            fs.appendFileSync(fileName, '<ReleaseDeal>\n');
            fs.appendFileSync(fileName, '<DealReleaseReference>R'+counter.toString()+'</DealReleaseReference>\n');
            fs.appendFileSync(fileName, '<Deal>\n');
            fs.appendFileSync(fileName, '<DealTerms>\n');
            
            
            fs.appendFileSync(fileName, '<CommercialModelType>subscriptionmodel</CommercialModelType>\n');
            fs.appendFileSync(fileName, '<Usage>\n');
            
            
            fs.appendFileSync(fileName, '<UseType>OnDemandStream</UseType>\n');
            //fs.appendFileSync(fileName, '<takedown>true</takedown>\n')
            fs.appendFileSync(fileName, '</Usage>\n');
            //NEW CHUNK
            
            
            
            fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
            fs.appendFileSync(fileName, '<ValidityPeriod>\n');
            
            
            fs.appendFileSync(fileName, '<StartDate>'+element.releaseDate+'</StartDate>\n');
            fs.appendFileSync(fileName, '</ValidityPeriod>');
            fs.appendFileSync(fileName, '</DealTerms>\n');
            fs.appendFileSync(fileName, '</Deal>\n');
            
            
            fs.appendFileSync(fileName, '<EffectiveDate>'+res+'</EffectiveDate>\n');
            fs.appendFileSync(fileName, '</ReleaseDeal>\n');
            /*fs.appendFileSync(fileName, '<ReleaseDeal>\n');
            fs.appendFileSync(fileName, '<DealReleaseReference>R'+counter+'</DealReleaseReference>\n');
            fs.appendFileSync(fileName, '<Deal>\n');
            fs.appendFileSync(fileName, '<DealTerms>\n');
            
            
            fs.appendFileSync(fileName, '<CommercialModelType>SubscriptionModelType</CommercialModelType>\n');
            fs.appendFileSync(fileName, '<Usage>\n');
            
            
            fs.appendFileSync(fileName, '<UseType>OnDemandStream</UseType>\n');
            fs.appendFileSync(fileName, '</Usage>\n');
            
           
            fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n')
            fs.appendFileSync(fileName, '<ValidityPeriod>\n');
            
           
            fs.appendFileSync(fileName, '<StartDate>'+date+'</StartDate>\n');
            fs.appendFileSync(fileName, '</ValidityPeriod>\n');
            fs.appendFileSync(fileName, '</DealTerms>\n');
            fs.appendFileSync(fileName, '</Deal>\n');
            
            
            fs.appendFileSync(fileName, '<EffectiveDate>'+date+'</EffectiveDate>\n');
            fs.appendFileSync(fileName, '</ReleaseDeal>\n');*/
            counter++;
            if(counter == silo.length){
                callback();
            }
            
            
        //}
        /*else{
            counter++;
            if(counter == silo.length){
                callback();
            }*/
        
    })
}

function releaseList(callback){
    counter = 0;
    //async.mapSeries(silo, function(element,callback){
    //console.log(element);   
    async.series([
        function(walim){
            //write the entry for the first shit on the list
            topper(walim);
        },
        function(walim){
            meat(walim);
        }
    ])
    function topper(walim){
            if(silo[0].resourceType == "SoundRecording"){
                mainCounter++;
                var plusMain = mainCounter + 1;
                var plusCount = counter + 1;
                var minusCount = counter - 1;
                //fs.appendFileSync(fileName, '<ReleaseList>\n');
                fs.appendFileSync(fileName, '<Release>\n');
                fs.appendFileSync(fileName, '<ReleaseId>\n');
                fs.appendFileSync(fileName, '<ICPN IsEan="false">'+silo[0].icpn+'</ICPN>\n');
                fs.appendFileSync(fileName, '<ProprietaryId Namespace="PADPIDA2014040303H">'+silo[0].proprietaryId+'</ProprietaryId>');
                fs.appendFileSync(fileName, '</ReleaseId>\n');
                var wok = counter - 1;
                fs.appendFileSync(fileName, '<ReleaseReference>R'+counter.toString()+'</ReleaseReference>\n');
                fs.appendFileSync(fileName, '<ReferenceTitle>\n');
                fs.appendFileSync(fileName, '<TitleText>'+silo[0].referenceTitle+'</TitleText>\n');
                fs.appendFileSync(fileName, '</ReferenceTitle>\n');
                fs.appendFileSync(fileName, '<ReleaseResourceReferenceList>\n');
                
                for(i=1;i<=silo.length;i++){
                    fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+i+'</ReleaseResourceReference>\n'); 
                }
                fs.appendFileSync(fileName, '</ReleaseResourceReferenceList>\n')
                fs.appendFileSync(fileName, '<ReleaseType>Album</ReleaseType>\n');
                /*if(counter == 0){
                    fs.appendFileSync(fileName, '<ReleaseType>Album</ReleaseType>\n');
                }
                else if(counter != 0){
                    fs.appendFileSync(fileName, '<ReleaseType>TrackRelease</ReleaseType>\n');
                }*/

                fs.appendFileSync(fileName, '<ReleaseDetailsByTerritory>\n');
                fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
                fs.appendFileSync(fileName, '<LabelName>'+silo[0].labelName+'</LabelName>\n');
                fs.appendFileSync(fileName, '<Title TitleType="DisplayTitle">\n');
                fs.appendFileSync(fileName, '<TitleText>'+silo[0].referenceTitle+'</TitleText>\n');
                fs.appendFileSync(fileName, '</Title>\n');
                fs.appendFileSync(fileName, '<DisplayArtist>\n');
                fs.appendFileSync(fileName, '<PartyName>\n');
                fs.appendFileSync(fileName, '<FullName>'+silo[0].fullName+'</FullName>\n');
                fs.appendFileSync(fileName, '</PartyName>\n');


                fs.appendFileSync(fileName, '<ArtistRole>MainArtist</ArtistRole>\n');
                fs.appendFileSync(fileName, '</DisplayArtist>\n');
                fs.appendFileSync(fileName, '<ParentalWarningType>'+silo[0].parentalWarningType+'</ParentalWarningType>\n');
                fs.appendFileSync(fileName, '<Genre>\n');
                fs.appendFileSync(fileName, '<GenreText>'+silo[0].genreText+'</GenreText>\n');
                
                if(silo[0].subGenre != undefined){
                    fs.appendFileSync(fileName, '<SubGenre>'+silo[0].subGenre+'</SubGenre>\n');
                }
                
                fs.appendFileSync(fileName, '</Genre>\n');
                fs.appendFileSync(fileName, '<OriginalReleaseDate>'+silo[0].releaseDate+'</OriginalReleaseDate>\n');
                fs.appendFileSync(fileName, '</ReleaseDetailsByTerritory>\n');
                fs.appendFileSync(fileName, '<PLine>\n');
                fs.appendFileSync(fileName, '<Year>'+silo[0].plineYear+'</Year>\n');
                fs.appendFileSync(fileName, '<PLineText>'+silo[0].plineText+'</PLineText>\n');
                fs.appendFileSync(fileName, '</PLine>\n');
                fs.appendFileSync(fileName, '<CLine>\n');
                fs.appendFileSync(fileName, '<Year>'+silo[0].clineYear+'</Year>\n');
                fs.appendFileSync(fileName, '<CLineText>'+silo[0].clineText+'</CLineText>\n');
                fs.appendFileSync(fileName, '</CLine>\n');
                fs.appendFileSync(fileName, '</Release>\n');
                var a = 0;
                var b = setTimeout(function(){
                    walim();
                }, a+=200)
            }
    }
    
    function meat(walim){
        counter = 0;
        silo.map(function(element){
        if(element.resourceType == "SoundRecording"){
            mainCounter++;
            var plusMain = mainCounter + 1;
            var plusCount = counter + 1;
            var minusCount = counter - 1;
            //fs.appendFileSync(fileName, '<ReleaseList>\n');
            fs.appendFileSync(fileName, '<Release>\n');
            fs.appendFileSync(fileName, '<ReleaseId>\n');
            fs.appendFileSync(fileName, '<ISRC>'+element.isrc+'</ISRC>\n');
            fs.appendFileSync(fileName, '<ProprietaryId Namespace="PADPIDA2014040303H">'+element.proprietaryId+'</ProprietaryId>');
            fs.appendFileSync(fileName, '</ReleaseId>\n');
            var wok = counter - 1;
            fs.appendFileSync(fileName, '<ReleaseReference>R'+plusCount.toString()+'</ReleaseReference>\n');
            fs.appendFileSync(fileName, '<ReferenceTitle>\n');
            fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>\n');
            fs.appendFileSync(fileName, '</ReferenceTitle>\n');
            fs.appendFileSync(fileName, '<ReleaseResourceReferenceList>\n');
            
         
            fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+plusCount+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+silo.length+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '</ReleaseResourceReferenceList>\n');
            
            

            
            fs.appendFileSync(fileName, '<ReleaseType>TrackRelease</ReleaseType>\n');
            
            
            fs.appendFileSync(fileName, '<ReleaseDetailsByTerritory>\n');
            
            
            fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
            fs.appendFileSync(fileName, '<LabelName>'+element.labelName+'</LabelName>\n');
            fs.appendFileSync(fileName, '<Title TitleType="DisplayTitle">\n');
            fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>\n');
            fs.appendFileSync(fileName, '</Title>\n');
            fs.appendFileSync(fileName, '<DisplayArtist>\n');
            fs.appendFileSync(fileName, '<PartyName>\n');
            fs.appendFileSync(fileName, '<FullName>'+element.fullName+'</FullName>\n');
            fs.appendFileSync(fileName, '</PartyName>\n');
            
            
            fs.appendFileSync(fileName, '<ArtistRole>MainArtist</ArtistRole>\n');
            fs.appendFileSync(fileName, '</DisplayArtist>\n');
            fs.appendFileSync(fileName, '<ParentalWarningType>'+element.parentalWarningType+'</ParentalWarningType>\n');
            fs.appendFileSync(fileName, '<Genre>\n');
            fs.appendFileSync(fileName, '<GenreText>'+element.genreText+'</GenreText>\n');
            if(silo[0].subGenre != undefined){
                    fs.appendFileSync(fileName, '<SubGenre>'+silo[0].subGenre+'</SubGenre>\n');
                }
            fs.appendFileSync(fileName, '</Genre>\n');
            fs.appendFileSync(fileName, '<OriginalReleaseDate>'+element.releaseDate+'</OriginalReleaseDate>\n');
            fs.appendFileSync(fileName, '</ReleaseDetailsByTerritory>\n');
            fs.appendFileSync(fileName, '<PLine>\n');
            fs.appendFileSync(fileName, '<Year>'+element.plineYear+'</Year>\n');
            fs.appendFileSync(fileName, '<PLineText>'+element.plineText+'</PLineText>\n');
            fs.appendFileSync(fileName, '</PLine>\n');
            fs.appendFileSync(fileName, '<CLine>\n');
            fs.appendFileSync(fileName, '<Year>'+element.clineYear+'</Year>\n');
            fs.appendFileSync(fileName, '<CLineText>'+element.clineText+'</CLineText>\n');
            fs.appendFileSync(fileName, '</CLine>\n');
            fs.appendFileSync(fileName, '</Release>\n');
            counter++;
        }
        
        else{
            counter++;
            if(counter == silo.length){
                walim();
                callback();
            }
        }
    })
    }
    
    /*silo.map(function(element){
        if(element.resourceType == "SoundRecording"){
            mainCounter++;
            var plusMain = mainCounter + 1;
            var plusCount = counter + 1;
            var minusCount = counter - 1;
            //fs.appendFileSync(fileName, '<ReleaseList>\n');
            fs.appendFileSync(fileName, '<Release>\n');
            fs.appendFileSync(fileName, '<ReleaseId>\n');
            fs.appendFileSync(fileName, '<ICPN IsEan="false">'+element.icpn+'</ICPN>\n');
            fs.appendFileSync(fileName, '<ProprietaryId Namespace="PADPIDA2014040303H">'+element.proprietaryId+'</ProprietaryId>');
            fs.appendFileSync(fileName, '</ReleaseId>\n');
            var wok = counter - 1;
            fs.appendFileSync(fileName, '<ReleaseReference>R'+counter.toString()+'</ReleaseReference>\n');
            fs.appendFileSync(fileName, '<ReferenceTitle>\n');
            fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>\n');
            fs.appendFileSync(fileName, '</ReferenceTitle>\n');
            fs.appendFileSync(fileName, '<ReleaseResourceReferenceList>\n');
            
            if(counter == 0){
                for(i=1;i<=silo.length;i++){
                   fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+i+'</ReleaseResourceReference>\n'); 
                }
            }
            else if(counter != 0){
                fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+counter+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+silo.length+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '</ReleaseResourceReferenceList>\n');
            }
            /*fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+plusCount+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '<ReleaseResourceReference ReleaseResourceType="PrimaryResource">A'+silo.length+'</ReleaseResourceReference>\n');
            fs.appendFileSync(fileName, '</ReleaseResourceReferenceList>\n');
            

            if(counter == 0){
                fs.appendFileSync(fileName, '<ReleaseType>Album</ReleaseType>\n');
            }
            else if(counter != 0){
                fs.appendFileSync(fileName, '<ReleaseType>TrackRelease</ReleaseType>\n');
            }
            
            fs.appendFileSync(fileName, '<ReleaseDetailsByTerritory>\n');
            
            
            fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
            fs.appendFileSync(fileName, '<LabelName>'+element.labelName+'</LabelName>\n');
            fs.appendFileSync(fileName, '<Title TitleType="DisplayTitle">\n');
            fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>\n');
            fs.appendFileSync(fileName, '</Title>\n');
            fs.appendFileSync(fileName, '<DisplayArtist>\n');
            fs.appendFileSync(fileName, '<PartyName>\n');
            fs.appendFileSync(fileName, '<FullName>'+element.fullName+'</FullName>\n');
            fs.appendFileSync(fileName, '</PartyName>\n');
            
            
            fs.appendFileSync(fileName, '<ArtistRole>MainArtist</ArtistRole>\n');
            fs.appendFileSync(fileName, '</DisplayArtist>\n');
            fs.appendFileSync(fileName, '<ParentalWarningType>'+element.parentalWarningType+'</ParentalWarningType>\n');
            fs.appendFileSync(fileName, '<Genre>\n');
            fs.appendFileSync(fileName, '<GenreText>'+element.genreText+'</GenreText>\n');
            fs.appendFileSync(fileName, '<SubGenre>'+element.subGenre+'</SubGenre>\n');
            fs.appendFileSync(fileName, '</Genre>\n');
            fs.appendFileSync(fileName, '<OriginalReleaseDate>'+element.releaseDate+'</OriginalReleaseDate>\n');
            fs.appendFileSync(fileName, '</ReleaseDetailsByTerritory>\n');
            fs.appendFileSync(fileName, '<PLine>\n');
            fs.appendFileSync(fileName, '<Year>'+element.plineYear+'</Year>\n');
            fs.appendFileSync(fileName, '<PLineText>'+element.plineText+'</PLineText>\n');
            fs.appendFileSync(fileName, '</PLine>\n');
            fs.appendFileSync(fileName, '<CLine>\n');
            fs.appendFileSync(fileName, '<Year>'+element.clineYear+'</Year>\n');
            fs.appendFileSync(fileName, '<CLineText>'+element.clineText+'</CLineText>\n');
            fs.appendFileSync(fileName, '</CLine>\n');
            fs.appendFileSync(fileName, '</Release>\n');
            counter++;
            
        }
        
        else{
            counter++;
            if(counter == silo.length){
                callback();
            }
        }
    })*/
}

function endResource(callback){
    var a = 0;
    fs.appendFileSync(fileName, '</ResourceList>\n');
    fs.appendFileSync(fileName, '<ReleaseList>\n')
    var b = setTimeout(function(){
        callback();  
    },a+=300);
}

function image(callback){
    console.log("in the image");    
    counter = 0;
    var md5gen;
    silo.map(function(element){
        if(element.resourceType == "Image"){
            
            async.series([
                function(cb){
                    console.log("generating md5 for "+element.fileName);
                    fs.readFile(element.fileName, function(err,buf){
                        if(err){console.log(err)}
                
                        /*md5gen = md5(buf);
                        console.log(md5(buf));
                        cb();*/
                        hash(element.fileName, 'md5', function(err,hash){
                            if(err){console.log(err)}
                            md5gen = hash;
                            cb();
                        })
                    })
                },
                function(cb){
                    counter++;
                    mainCounter++;
                    fs.appendFileSync(fileName, '<Image>\n');

                    //WHERE DO I GET THE IMAGE TYPE (cover?)
                    fs.appendFileSync(fileName, '<ImageType>FrontCoverImage</ImageType>\n');
                    fs.appendFileSync(fileName, '<ImageId>\n');
                    fs.appendFileSync(fileName, '<ProprietaryId Namespace="PADPIDA2014040303H">'+element.proprietaryId+'</ProprietaryId>');
                    fs.appendFileSync(fileName, '</ImageId>\n');
                    fs.appendFileSync(fileName, '<ResourceReference>A'+mainCounter+'</ResourceReference>\n')
                    fs.appendFileSync(fileName, '<ImageDetailsByTerritory>\n');


                    fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
                    fs.appendFileSync(fileName, '<TechnicalImageDetails>\n');
                    fs.appendFileSync(fileName, '<TechnicalResourceDetailsReference>T'+counter+'</TechnicalResourceDetailsReference>\n');


                    fs.appendFileSync(fileName, '<ImageCodecType>JPEG</ImageCodecType>\n')
                    fs.appendFileSync(fileName, '<ImageHeight>2000</ImageHeight>\n');
                    fs.appendFileSync(fileName, '<ImageWidth>2000</ImageWidth>\n');
                    fs.appendFileSync(fileName, '<File>\n');
                    fs.appendFileSync(fileName, '<FileName>'+element.fileName+'</FileName>\n');
                    fs.appendFileSync(fileName, '<FilePath>'+element.filePath+'</FilePath>\n');
                    fs.appendFileSync(fileName, '<HashSum>\n');


                    fs.appendFileSync(fileName, '<HashSum>'+md5gen+'</HashSum>\n');
                    fs.appendFileSync(fileName, '<HashSumAlgorithmType>MD5</HashSumAlgorithmType>\n');
                    fs.appendFileSync(fileName, '</HashSum>\n');
                    fs.appendFileSync(fileName, '</File>\n')
                    fs.appendFileSync(fileName, '</TechnicalImageDetails>\n');
                    fs.appendFileSync(fileName, '</ImageDetailsByTerritory>\n');
                    fs.appendFileSync(fileName, '</Image>\n');

                    if(counter == silo.length){
                        callback();
                        cb();
                    }
                }
                
            ])
            
            
        }
        else{
            counter++;
            if(counter == silo.length){
                callback();
            }
        }
    })
}

function soundRecording(callback){
    var mar = false;
    var md5gen;
    var crypto = require('crypto');
    var md5holder = crypto.createHash('md5');
    async.mapSeries(silo, function(element,cb2){
    //silo.map(function(element){
        //console.log(element);
        
        if(element.resourceType == "SoundRecording"){
            var file = fs.readFileSync(element.fileName);
            console.log(element);
            async.series([
                function(cb){
                    console.log("generating md5 for "+element.fileName);
                    /*fs.readFile(element.fileName, function(err,buf){
                        if(err){console.log(err)}
                        //console.log(buf);
                        md5gen = md5(buf);
                        process.on('uncaughtException', function(err){
                            console.log('CAUGHT THE ERROR '+err)
                        })
                        console.log(md5(buf));
                        cb();
                    })*/
                    /*var s = fs.ReadStream(element.fileName);
                    md5gen = null
                    s.on('data', function(d){
                        md5holder.update(d);
                    })
                    s.on('end', function(){
                        var d = md5holder.digestFinal('hex');
                        md5gen = d;
                        console.log(d);
                        cb();
                    })*/
                    hash(element.fileName, 'md5', function(err,hash){
                        if(err){console.log(err)}
                        md5gen = hash;
                        cb();
                    })
                    
                },
                function(cb){
                    counter++;
                    mainCounter++;
                    console.log("writing xml for "+element.fileName);
                    /*fs.readFile(element.fileName, function(err,buf){
                        if(err){console.log(err)}

                        md5gen = md5(buf);
                        console.log(md5(buf));
                    })*/

                    fs.appendFileSync(fileName, '<SoundRecording>\n');
                    fs.appendFileSync(fileName, '<SoundRecordingType>MusicalWorkSoundRecording</SoundRecordingType>\n');
                    fs.appendFileSync(fileName, '<SoundRecordingId>\n');
                    fs.appendFileSync(fileName, '<ISRC>'+element.isrc+'</ISRC>\n');
                    fs.appendFileSync(fileName, '<ProprietaryId Namespace="PADPIDA2014040303H">'+element.proprietaryId+'</ProprietaryId>\n');
                    fs.appendFileSync(fileName, '</SoundRecordingId>\n');
                    fs.appendFileSync(fileName, '<ResourceReference>A'+mainCounter+'</ResourceReference>\n');
                    fs.appendFileSync(fileName, '<ReferenceTitle>\n');
                    fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>');
                    fs.appendFileSync(fileName, '</ReferenceTitle>\n');
                    fs.appendFileSync(fileName, '<Duration>'+element.duration+'</Duration>\n');
                    fs.appendFileSync(fileName, '<SoundRecordingDetailsByTerritory>\n');



                    fs.appendFileSync(fileName, '<TerritoryCode>Worldwide</TerritoryCode>\n');
                    fs.appendFileSync(fileName, '<Title TitleType="DisplayTitle">\n');
                    fs.appendFileSync(fileName, '<TitleText>'+element.referenceTitle+'</TitleText>\n');
                    fs.appendFileSync(fileName, '</Title>\n');
                    fs.appendFileSync(fileName, '<DisplayArtist>\n')
                    fs.appendFileSync(fileName, '<PartyName>\n');
                    fs.appendFileSync(fileName, '<FullName>'+element.fullName+'</FullName>');
                    fs.appendFileSync(fileName, '</PartyName>\n');


                    fs.appendFileSync(fileName, '<ArtistRole>MainArtist</ArtistRole>');
                    fs.appendFileSync(fileName, '</DisplayArtist>\n');
                    fs.appendFileSync(fileName, '<LabelName>'+element.labelName+'</LabelName>\n');
                    fs.appendFileSync(fileName, '<PLine>\n');
                    fs.appendFileSync(fileName, '<Year>'+element.plineYear+'</Year>\n');
                    fs.appendFileSync(fileName, '<PLineText>'+element.plineText+'</PLineText>\n');
                    fs.appendFileSync(fileName, '</PLine>\n');
                    fs.appendFileSync(fileName, '<Genre>\n');
                    fs.appendFileSync(fileName, '<GenreText>'+element.genreText+'</GenreText>\n');
                    if(silo[0].subGenre != undefined){
                        fs.appendFileSync(fileName, '<SubGenre>'+silo[0].subGenre+'</SubGenre>\n');
                    }
                    fs.appendFileSync(fileName, '</Genre>\n');
                    fs.appendFileSync(fileName, '<ParentalWarningType>'+element.parentalWarningType+'</ParentalWarningType>\n');
                    fs.appendFileSync(fileName, '<TechnicalSoundRecordingDetails>\n');
                    fs.appendFileSync(fileName, '<TechnicalResourceDetailsReference>T'+mainCounter+'</TechnicalResourceDetailsReference>\n');
                    fs.appendFileSync(fileName, '<File>\n');
                    fs.appendFileSync(fileName, '<FileName>'+element.fileName+'</FileName>\n');
                    fs.appendFileSync(fileName, '<FilePath>'+element.filePath+'</FilePath>\n');
                    fs.appendFileSync(fileName, '<HashSum>\n');
                    fs.appendFileSync(fileName, '<HashSum>'+md5gen+'</HashSum>\n');
                    fs.appendFileSync(fileName, '<HashSumAlgorithmType>MD5</HashSumAlgorithmType>\n');
                    fs.appendFileSync(fileName, '</HashSum>\n');
                    fs.appendFileSync(fileName, '</File>\n');
                    fs.appendFileSync(fileName, '</TechnicalSoundRecordingDetails>\n')
                    fs.appendFileSync(fileName, '</SoundRecordingDetailsByTerritory>\n');
                    fs.appendFileSync(fileName, '</SoundRecording>\n');
                    /*if(counter == silo.length){
                        mar = true;
                        console.log("mar is true");
                        //callback();
                        cb();
                    }*/
                    var a = 0
                    var b = setTimeout(function(){
                        console.log("got here "+counter+" "+silo.length);
                        if(counter == 18){
                            for(i in silo){
                                console.log(silo[i])
                            }
                        }
                        cb();
                        cb2()
                        if(counter == silo.length){
                            callback();
                        }
                    }, a+=1000)
                }
            ])
            
        }
        else{
            counter++;
            if(counter == silo.length){
                callback();
            }
        }
        
    })
}

/*if(counter == 0){
                fs.appendFileSync(fileName, '<ReleaseType>Album</ReleaseType>\n');
            }
            else if(counter != 0){
                fs.appendFileSync(fileName, '<ReleaseType>TrackRelease</ReleaseType>\n');
            }*/