from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from database_setupV2 import Base, Campground,CampSite
from flask import Flask, render_template, request, jsonify, send_file
from bs4 import BeautifulSoup
import requests
import datetime
import tweepy
import xmltodict
import json

application = Flask(__name__)
application.config['DEBUG'] = True

engine = create_engine('sqlite:///campgroundsV2.db',connect_args={'check_same_thread':False})
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()




@application.route('/_weatherMonth', methods = ['POST'])
def weatherMonth():
    nameToNum={'Jan':1,'Feb':2,'Mar':3,'Apr':4,'Man':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
    q='''SELECT nameID, minTempsubnum AS minTemp, maxTempsubnum AS maxTemp FROM Campground'''.replace('subnum',str(nameToNum[request.get_json()['weatherMonth']]))
    result = engine.execute(text(q))
    nameID=[]
    maxTemp=[]
    minTemp=[]
    for itemDB in result:
        nameID.append(itemDB['nameID'])
        maxTemp.append(itemDB['maxTemp']) 
        minTemp.append(itemDB['minTemp'])
    return jsonify({'nameID':nameID,'minTemp':minTemp,'maxTemp':maxTemp})

@application.route('/_weatherMonthSingle', methods = ['POST'])
def weatherMonthSingle():
    nameToNum={'Jan':1,'Feb':2,'Mar':3,'Apr':4,'Man':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
    nameID = request.get_json()['nameID']
    q='''SELECT minTempsubnum AS minTemp, maxTempsubnum AS maxTemp FROM Campground WHERE nameID="subnameID"'''.replace('subnum',str(nameToNum[request.get_json()['weatherMonth']]))
    q=q.replace('subnameID',nameID)
    result = engine.execute(text(q))
    for itemDB in result:
        maxTemp=itemDB['maxTemp']
        minTemp=itemDB['minTemp']
    return jsonify({'nameID':nameID,'minTemp':minTemp,'maxTemp':maxTemp})

@application.route('/_locationChoiceSingleOrig', methods = ['POST'])
def locationDistanceSingleOrig():
    # Get the parsed contents of the form data
    startLocation = request.get_json()['startLocation']
    nameID = request.get_json()['nameID']
    q='''SELECT latitude, longitude FROM Campground WHERE nameID="subname"'''.replace('subname',nameID)
    result = engine.execute(text(q))
    for itemDB in result:
        locationLat=itemDB['latitude']
        locationLong=itemDB['longitude']
    q='''SELECT latitude, longitude FROM CityCA WHERE name="subname"'''.replace('subname',startLocation)
    result = engine.execute(text(q))
    for itemDB in result:
        startLong=itemDB['longitude']
        startLat=itemDB['latitude']
    url='https://maps.googleapis.com/maps/api/distancematrix/json?origins='
    url=url+str(startLat)+','+str(startLong)+'&destinations='
    url=url+str(locationLat)+','+str(locationLong)
    data = requests.get(url).text
    data = json.loads(data)
    if data['status']=='OK':
        return jsonify({'nameID':nameID,'distance':data['rows'][0]['elements'][0]['duration']['text']})
    else:
        return jsonify({'nameID':nameID,'distance':''})

@application.route('/_locationChoiceSingle', methods = ['POST'])
def locationDistanceSingle():
    # Get the parsed contents of the form data
    startLocation = request.get_json()['startLocation']
    nameID = request.get_json()['nameID']
    q='''SELECT nameID, distHour, distMinute FROM CityDistance 
            WHERE city="subcity"
            AND nameID="subnameID"'''.replace('subcity',startLocation).replace('subnameID',nameID)
    result = engine.execute(text(q))
    for itemDB in result:
        nameIDret=itemDB['nameID']
        if itemDB['distHour']!=0:
            distanceret=str(itemDB['distHour'])+' hr '+str(itemDB['distMinute'])+' min'
        else:
            distanceret=str(itemDB['distMinute'])+' min'


    return jsonify({'nameID':nameID,'distance':distanceret})


@application.route('/_locationChoice', methods = ['POST'])
def locationDistance():
    startLocation = request.get_json()['startLocation']
    q='''SELECT nameID, distHour, distMinute FROM CityDistance WHERE city="subcity"'''.replace('subcity',startLocation)
    result = engine.execute(text(q))
    nameIDret=[]
    distanceret=[]
    for itemDB in result:
        nameIDret.append(itemDB['nameID'])
        if itemDB['distHour']!=0:
            distanceret.append(str(itemDB['distHour'])+' hr '+str(itemDB['distMinute'])+' min')
        else:
            distanceret.append(str(itemDB['distMinute'])+' min')
    return jsonify({'nameID':nameIDret,'distance':distanceret})

@application.route('/_locationChoiceOrig', methods = ['POST'])
def locationDistanceOrig():
    # Get the parsed contents of the form data
    startLocation = request.get_json()['startLocation']
    q='''SELECT nameID, latitude, longitude FROM Campground''' 
    result = engine.execute(text(q))
    nameID=[]
    locationLat=[]
    locationLong=[]
    for itemDB in result:
        nameID.append(itemDB['nameID'])
        locationLat.append(itemDB['latitude'])
        locationLong.append(itemDB['longitude'])
    q='''SELECT latitude, longitude FROM CityCA WHERE name="subname"'''.replace('subname',startLocation)
    result = engine.execute(text(q))
    for itemDB in result:
        startLong=itemDB['longitude']
        startLat=itemDB['latitude']
    url='https://maps.googleapis.com/maps/api/distancematrix/json?origins='
    url=url+str(startLat)+','+str(startLong)+'&destinations='
    nameIDret=[]
    distanceret=[]
    nameTemp=[]
    for index, (latIndex,longIndex,nameIndex) in enumerate(zip(locationLat,locationLong,nameID)):
        url=url+str(latIndex)+','+str(longIndex)+'|'
        nameTemp.append(nameIndex)
        if index%5==0:
            url=url[:-1]
            data = requests.get(url).text
            data = json.loads(data)
            for item,nameTempIndex in zip(data['rows'][0]['elements'],nameTemp):
                if item['status']=='OK':
                    nameIDret.append(nameTempIndex)
                    distanceret.append(item['duration']['text'])
            url='https://maps.googleapis.com/maps/api/distancematrix/json?origins='
            url=url+str(startLat)+','+str(startLong)+'&destinations='
            nameTemp=[]
    url=url[:-1]
    data = requests.get(url).text
    data = json.loads(data) # json to python library
    for item,nameTempIndex in zip(data['rows'][0]['elements'],nameTemp):
        if item['status']=='OK':
            nameIDret.append(nameTempIndex)
            distanceret.append(item['duration']['text'])
    # Render template
    return jsonify({'nameID':nameIDret,'distance':distanceret})




@application.route('/campground/<string:nameID>')
def campgroundLandingPageSimple(nameID=None):

    q='''SELECT name, climate, desert, redwood, beach, lake, river, rating, bookingDifficulty FROM Campground WHERE nameID=:nameID'''
    result = engine.execute(text(q),nameID=nameID)
    for itemDB in result:
        rating=itemDB['rating']
        heading=itemDB['name']
        climate=itemDB['climate']
        if itemDB['redwood']==1:
            climate+=', redwood forest'
        if itemDB['beach']:
            climate+=', beach'
        if itemDB['lake']:
            climate+=', lake'
        if itemDB['river']:
            climate+=', river'
        booking=itemDB['bookingDifficulty']
        if booking==1:
            booking='Usually space the next weekend.'
        if booking==2:
            booking='Book a couple of weeks ahead of time.'
        if booking==3:
            booking='Book a couple of months ahead of time.'
        if booking==4:
            booking='Book as soon as booking is allowed.'
    q='''SELECT SUM(numSites) AS numSites FROM CampSite WHERE nameID=:nameID
            AND ADA=0
            AND (  siteType="ENVIRONMENTAL SITE" 
                OR siteType="CABIN" 
                OR siteType="RV/TRAILER ONLY" 
                OR siteType="STANDARD" 
                OR siteType="TENT ONLY SITE" 
                OR siteType="TENT ONLY - WALK-IN" 
                OR siteType="YURT" 
                OR siteType="Double Hook-Up" 
                OR siteType="HOOK-UP" 
                OR siteType="CAMPING PACKAGE" 
                OR siteType="DELUXE CABIN" 
                OR siteType="COTTAGE" 
                OR siteType="HOTEL ROOM" )'''
    result = engine.execute(text(q),nameID=nameID)
    for itemDB in result:
        numSites=itemDB['numSites']

    numToName={0:'Jan', 1:'Feb', 2:'Mar', 3:'Apr', 4:'May', 5:'Jun', 6:'Jul', 7:'Aug', 8:'Sep', 9:'Oct', 10:'Nov', 11:'Dec'}
    currentMonth=datetime.date.today().month-1
    currentYear=datetime.date.today().year
    calendar1=[]
    calendar2=[]
    for i in range(4):
        if currentMonth+i<12:
            calendar1.append(numToName[(currentMonth+i)%12]+' '+str(currentYear))
        else:
            calendar1.append(numToName[(currentMonth+i)%12]+' '+str(currentYear+1))
        if currentMonth+i+4<12:
            calendar2.append(numToName[(currentMonth+i+4)%12]+' '+str(currentYear))
        else:
            calendar2.append(numToName[(currentMonth+i+4)%12]+' '+str(currentYear+1))
    return render_template('campgroundSimple.html',pageID=nameID,heading=heading,
                            calendar1=calendar1,calendar2=calendar2,
                            yelpRating=rating,climate=climate,numSites=numSites,booking=booking,
                            tweet=createTweet(heading),
                            image='/photos/'+nameID)



@application.route('/_getSimilar',methods = ['POST'])
def getSimilar():
    nameID1=request.get_json()['pageID']
    currentMonth=datetime.date.today().month
    q="""
            SELECT  climate, desert, redwood, beach, lake, river FROM Campground
            WHERE nameID=:nameID
    """
    result = engine.execute(text(q),nameID=nameID1)
    for itemDB in result:
        climate=itemDB['climate']
        desert=itemDB['desert'] 
        redwood=itemDB['redwood'] 
        beach=itemDB['beach'] 
        lake=itemDB['lake'] 
        river=itemDB['river']
    q='''
            SELECT  name, nameID, (CASE WHEN climate == "subclimate"  THEN 1 ELSE 0 END)+
                    (CASE WHEN desert == subdesert AND subdesert == 1 THEN 1 ELSE 0 END)+
                    (CASE WHEN redwood == subredwood AND subredwood == 1 THEN 1 ELSE 0 END)+
                    (CASE WHEN beach == subbeach AND subbeach == 1 THEN 1 ELSE 0 END)+
                    (CASE WHEN lake == sublake AND sublake == 1 THEN 1 ELSE 0 END)+
                    (CASE WHEN river == subriver AND subriver == 1 THEN 1 ELSE 0 END) AS figureOfMerit,
                    climate,desert,redwood,beach,lake,river,rating,bookingDifficulty,
                    minTempsubMonth AS minTemp,maxTempsubMonth AS maxTemp
                      FROM Campground  
                      WHERE nameID!=:nameID
                      ORDER BY figureOfMerit DESC
                                
    '''.replace('subMonth',str(currentMonth))
    q=q.replace('subclimate',climate).replace('subdesert',str(desert)).replace('subredwood',str(redwood))
    q=q.replace('subbeach',str(beach)).replace('sublake',str(lake)).replace('subriver',str(river))
    
    result = engine.execute(text(q),nameID=nameID1)
    name=[]
    nameID=[]
    figureOfMerit=[]
    yelpRating=[]
    bookingDifficulty=[]
    temperature=[]
    for itemDB in result:
        name.append(itemDB['name'])
        nameID.append(itemDB['nameID'])
        figureOfMerit.append(itemDB['figureOfMerit'])
        yelpRating.append(itemDB['rating'])
        if itemDB['bookingDifficulty']==1:
            bookingDifficulty.append('Usually space the next weekend.')
        if itemDB['bookingDifficulty']==2:
            bookingDifficulty.append('Book a couple of weeks ahead of time.')
        if itemDB['bookingDifficulty']==3:
            bookingDifficulty.append('Book a couple of months ahead of time.')
        if itemDB['bookingDifficulty']==4:
            bookingDifficulty.append('Book as soon as booking is allowed.')
        temperature.append(str(int(itemDB['minTemp']/10))+'/'+str(int(itemDB['maxTemp']/10))+" F")    
    maxFOM=max(figureOfMerit)

    name2=[]
    nameID2=[]
    figureOfMerit2=[]
    yelpRating2=[]
    bookingDifficulty2=[]
    temperature2=[]
    distance2=[]
    for index,FOM in enumerate(figureOfMerit):
        if FOM==maxFOM:
            name2.append(name[index])#is there a cleaner way to do this???
            nameID2.append(nameID[index])
            figureOfMerit2.append(figureOfMerit[index])
            yelpRating2.append(yelpRating[index])
            bookingDifficulty2.append(bookingDifficulty[index])
            temperature2.append(temperature[index])
            q='''SELECT distHour,distMinute 
                FROM CampgroundDistance
                WHERE nameID1=:nameID1 
                    AND nameID2=:nameID2
            '''
            result = engine.execute(text(q),nameID1=nameID1,nameID2=nameID[index])
            for itemDB in result:
                distance2.append(str(itemDB['distHour'])+' hr '+str(itemDB['distMinute'])+' min')
        elif len(name2)<3 and FOM>=maxFOM-1 and FOM-1>-1:#this is ugly
            name2.append(name[index])#is there a cleaner way to do this???
            nameID2.append(nameID[index])
            figureOfMerit2.append(figureOfMerit[index])
            yelpRating2.append(yelpRating[index])
            bookingDifficulty2.append(bookingDifficulty[index])
            temperature2.append(temperature[index])
            q='''SELECT distHour,distMinute 
                FROM CampgroundDistance
                WHERE nameID1=:nameID1 
                    AND nameID2=:nameID2
            '''
            result = engine.execute(text(q),nameID1=nameID1,nameID2=nameID[index])
            for itemDB in result:
                distance2.append(str(itemDB['distHour'])+' hrs '+str(itemDB['distMinute'])+' mins')
    return jsonify({'nameID':nameID2,'name':name2, 'yelpRating': yelpRating2, 'bookingDifficulty': bookingDifficulty2, 'temperature': temperature2, 'distance': distance2})


@application.route('/calendarWindow/<string:nameID>')
def calendarWindow(nameID=None):
    numToName={0:'Jan', 1:'Feb', 2:'Mar', 3:'Apr', 4:'May', 5:'Jun', 6:'Jul', 7:'Aug', 8:'Sep', 9:'Oct', 10:'Nov', 11:'Dec'}
    currentMonth=datetime.date.today().month-1
    currentYear=datetime.date.today().year
    calendar1=[]
    calendar2=[]
    for i in range(4):
        if currentMonth+i<12:
            calendar1.append(numToName[(currentMonth+i)%12]+' '+str(currentYear))
        else:
            calendar1.append(numToName[(currentMonth+i)%12]+' '+str(currentYear+1))
        if currentMonth+i+4<12:
            calendar2.append(numToName[(currentMonth+i+4)%12]+' '+str(currentYear))
        else:
            calendar2.append(numToName[(currentMonth+i+4)%12]+' '+str(currentYear+1))

    return render_template('calendarWindow.html',pageID=nameID,calendar1=calendar1,calendar2=calendar2)

@application.route('/listView')
def explore():
    """The home page"""
    q='''SELECT name, nameID, rating, bookingDifficulty, climate, redwood, beach, lake, river FROM Campground
        ORDER BY name'''
    result = engine.execute(text(q))
    names=[]
    nameIDs=[]
    bookingDifficulty=[]
    yelpRating=[]
    climate=[]
    for itemDB in result:
        if itemDB['bookingDifficulty']>0:
            climateTemp=itemDB['climate']
            if itemDB['redwood']==1:
                climateTemp+=', redwood forest'
            if itemDB['beach']:
                climateTemp+=', beach'
            if itemDB['lake']:
                climateTemp+=', lake'
            if itemDB['river']:
                climateTemp+=', river'
            climate.append(climateTemp)
            names.append(itemDB['name'])
            nameIDs.append(itemDB['nameID'])
            bookingDifficulty.append(itemDB['bookingDifficulty'])
            yelpRating.append(itemDB['rating'])
    q='''SELECT name FROM CityCA ORDER BY name'''
    result = engine.execute(text(q))
    city=[itemDB['name'] for itemDB in result]
    return render_template('explore.html',
            heading='Explore. Discover. Experience. \n Your Adventure Portal.',
            pageID='listView',cities=city,climate=climate,
            names=names,nameIDs=nameIDs,bookingDifficulty=bookingDifficulty,yelpRating=yelpRating)


@application.route('/')
@application.route('/mapView')
def mapView():
    """The home page"""
    q='''SELECT name, nameID, rating, bookingDifficulty FROM Campground'''
    result = engine.execute(text(q))
    names=[]
    nameIDs=[]
    bookingDifficulty=[]
    yelpRating=[]
    for itemDB in result:
        if itemDB['bookingDifficulty']>0:
            names.append(itemDB['name'])
            nameIDs.append(itemDB['nameID'])
            bookingDifficulty.append(itemDB['bookingDifficulty'])
            yelpRating.append(itemDB['rating'])
    q='''SELECT name FROM CityCA ORDER BY name'''
    result = engine.execute(text(q))
    city=[itemDB['name'] for itemDB in result]
    return render_template('mapView.html',
            heading='Explore. Discover. Experience. \n Your Adventure Portal.',
            pageID='mapView',cities=city,
            names=names,nameIDs=nameIDs,bookingDifficulty=bookingDifficulty,yelpRating=yelpRating)

#####Map Functions#####
@application.route('/_mapMarkers',methods = ['POST'])
def mapMarkers():
    pageID=request.get_json()['pageID']
    markers=[]
    if pageID=='explore' or pageID=='mapView':
        q='''SELECT name, nameID, latitude, climate, redwood, beach, lake, river, longitude, rating, bookingDifficulty FROM Campground'''
        result = engine.execute(text(q))
        for itemDB in result:
            climate=itemDB['climate']
            if itemDB['redwood']==1:
                climate+=', redwood forest'
            if itemDB['beach']:
                climate+=', beach'
            if itemDB['lake']:
                climate+=', lake'
            if itemDB['river']:
                climate+=', river'
            latitude=itemDB['latitude']
            longitude=itemDB['longitude']
            name=itemDB['name']
            nameID=itemDB['nameID']
            yelpRating=itemDB['rating']
            bookingDifficulty=itemDB['bookingDifficulty']
            markers.append({'name':name,'nameID':nameID,'climate':climate, 'latitude':latitude,'longitude':longitude,'color':'blue', 'yelpRating': yelpRating, 'bookingDifficulty': bookingDifficulty})
    else:
        q='''SELECT name, nameID, latitude, longitude, rating, bookingDifficulty  FROM Campground 
                WHERE nameID="subnameID"'''.replace('subnameID',pageID)
        result = engine.execute(text(q))
        for itemDB in result:
            latitude=itemDB['latitude']
            longitude=itemDB['longitude']
            name=itemDB['name']
            nameID=itemDB['nameID']
            yelpRating=itemDB['rating']
            bookingDifficulty=itemDB['bookingDifficulty']
        markers.append({'name':name,'nameID':nameID,'latitude':latitude,'longitude':longitude,'color':'blue', 'yelpRating': yelpRating, 'bookingDifficulty': bookingDifficulty})
    
    return jsonify(markers=markers)


@application.route('/_getNearby',methods = ['POST'])
def getNearby():
    currentMonth=datetime.date.today().month
    nameID1=request.get_json()['pageID']
    q='''SELECT Campground.name AS name, Campground.nameID AS nameID2, 
            CampgroundDistance.distHour AS distHour, CampgroundDistance.distMinute AS distMinute, 
            Campground.latitude AS latitude, Campground.longitude AS longitude,
            Campground.rating AS rating, Campground.bookingDifficulty AS bookingDifficulty,
            Campground.minTempsubMonth AS minTemp, Campground.maxTempsubMonth AS maxTemp
        FROM CampgroundDistance
        JOIN Campground 
            ON CampgroundDistance.nameID2=Campground.nameID
        WHERE CampgroundDistance.nameID1=:nameID1 
            AND distHour<2
            AND CampgroundDistance.nameID2!=:nameID1
    '''.replace('subMonth',str(currentMonth))



    result = engine.execute(text(q),nameID1=nameID1)


    nameID2=[]
    name=[]
    latitude=[]
    longitude=[]
    distMinute=[]
    distHour=[]
    yelpRating=[]
    bookingDifficulty=[]
    minTemp=[]
    maxTemp=[]
    for itemDB in result:
        nameID2.append(itemDB['nameID2'])
        name.append(itemDB['name'])
        latitude.append(itemDB['latitude'])
        longitude.append(itemDB['longitude'])
        distMinute.append(itemDB['distMinute'])
        distHour.append(itemDB['distHour'])
        yelpRating.append(itemDB['rating'])
        bookingDifficulty.append(itemDB['bookingDifficulty'])
        minTemp.append(int(itemDB['minTemp']/10.0))
        maxTemp.append(int(itemDB['maxTemp']/10.0))
    return jsonify({'nameID': nameID2, 'name': name, 'distMinute': distMinute, 'distHour': distHour, 
            'longitude': longitude, 'latitude': latitude, 'yelpRating': yelpRating, 
            'bookingDifficulty': bookingDifficulty, 'minTemp': minTemp, 'maxTemp': maxTemp})

########Calendar Functions#######

@application.route('/_getCalendarMonth',methods = ['POST'])
def getCalendarMonth():
    data=request.get_json()
    months={'Jan': 1, 'Feb': 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug' : 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12}
    monthArray,avaliArray=findAvailabilityMonth(data['pageID'],int(months[data['month']]),int(data['year']))
    return jsonify({'monthArray':monthArray,'avaliArray':avaliArray})

def findAvailabilityMonth(nameID,month,year):
    import calendar
    currentDay=datetime.date.today().day
    parkID=session.query(Campground).filter_by(nameID=nameID).one().parkID
    q='''SELECT siteID FROM CampSite
            WHERE nameID=:nameID
            AND ADA=0
            AND (  siteType="ENVIRONMENTAL SITE" 
                OR siteType="CABIN" 
                OR siteType="RV/TRAILER ONLY" 
                OR siteType="STANDARD" 
                OR siteType="TENT ONLY SITE" 
                OR siteType="TENT ONLY - WALK-IN" 
                OR siteType="YURT" 
                OR siteType="Double Hook-Up" 
                OR siteType="HOOK-UP" 
                OR siteType="CAMPING PACKAGE" 
                OR siteType="DELUXE CABIN" 
                OR siteType="COTTAGE" 
                OR siteType="HOTEL ROOM" )
    '''#.replace('subprimaryID',str(int(primaryID)))
    currentDay=datetime.date.today().day
    currentMonth=datetime.date.today().month
    currentYear=datetime.date.today().year

    if currentMonth==month and currentYear==year:
        dateInput=datetime.datetime.strptime(str(month)+"/"+str(currentDay)+"/"+str(year),"%m/%d/%Y")
    else:
        dateInput=datetime.datetime.strptime(str(month)+"/1/"+str(year),"%m/%d/%Y")
    monthArray=[['' for i in range(7)] for j in range(6)]
    avaliArray=[[0 for i in range(7)] for j in range(6)]
    daysToStart=calendar.monthrange(year,month)[0]
    totDays=calendar.monthrange(year,month)[1]
    for indexNum,index0 in zip(range(daysToStart,totDays+daysToStart),range(0,totDays)):
        monthArray[int(indexNum/7)][int(indexNum%7)]=str(index0+1)
        indexDate=datetime.datetime.strptime(str(month)+"/"+str(index0+1)+"/"+str(year),"%m/%d/%Y")
        if indexDate==dateInput: #it is not the past
            datePage=dateInput
            result = engine.execute(text(q),nameID=nameID)
            for itemDB in result:
                siteID=itemDB['siteID']
                url="http://www.reserveamerica.com/campsiteDetails.do?arvdate="+dateInput.strftime("%m/%d/%Y")+"&contractCode=CA&parkId="+str(parkID)+"&siteId="+str(siteID)
                r = requests.get(url)
                soup = BeautifulSoup(r.content)
                gData = soup.find_all("td",{"class": "status"})
                datePage=dateInput
                indexPage=indexNum
                for item in gData:
                    siteStatus=item.text
                    avaliArray[int(indexPage/7)][int(indexPage%7)]=(avaliArray[int(indexPage/7)][int(indexPage%7)]+
                    int(filter(lambda x: x.isdigit(),siteStatus) if filter(lambda x: x.isdigit(),siteStatus) else (1 if siteStatus=='A' else 0)))
                    datePage+=datetime.timedelta(days=1)
                    indexPage+=1
                    if datePage.month>month or datePage.year>year:
                        break
            #conn.close()
            dateInput=datePage
    return monthArray,avaliArray
            
#######Weather########

@application.route('/_getWeather',methods = ['POST'])
def getWeather():
    nameID=request.get_json()['pageID']
    q='''SELECT latitude, longitude FROM Campground WHERE nameID=:nameID'''
    result = engine.execute(text(q),nameID=nameID)
    for itemDB in result:
        latitude=itemDB['latitude']
        longitude=itemDB['longitude']
    url='http://forecast.weather.gov/MapClick.php?lat='+str(latitude)+'&lon='+str(longitude)+'&unit=0&lg=english&FcstType=dwml'
    r = requests.get(url).text
    period=[]
    condition=[]
    temperature=[]
    icon=[]
    nextPeriod=xmltodict.parse(r)['dwml']['data'][0]['time-layout'][0]['start-valid-time'][0]['@period-name']
    if(nextPeriod=='Tonight'):
        a=0
        b=1
    else:
        a=1
        b=0
    a=0
    b=1
    totLength=(len(xmltodict.parse(r)['dwml']['data'][0]['parameters']['weather']['weather-conditions']))
    for i in range(7):
        period.append(xmltodict.parse(r)['dwml']['data'][0]['time-layout'][0]['start-valid-time'][2*i]['@period-name'])
        icon.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['conditions-icon']['icon-link'][2*i])
        condition.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['weather']['weather-conditions'][2*i]['@weather-summary'].replace('Chc','Chance'))
        temperature.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['temperature'][a]['value'][i])
        if totLength==14 or i!=6:
            period.append(xmltodict.parse(r)['dwml']['data'][0]['time-layout'][0]['start-valid-time'][2*i+1]['@period-name'])
            icon.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['conditions-icon']['icon-link'][2*i+1])
            condition.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['weather']['weather-conditions'][2*i+1]['@weather-summary'].replace('Chc','Chance'))
            temperature.append(xmltodict.parse(r)['dwml']['data'][0]['parameters']['temperature'][b]['value'][i])
    return jsonify({'period':period,'condition':condition,'temperature':temperature,'icon':icon})


@application.route('/weatherData/<string:nameID>')
def weatherData(nameID=None):

    q='''SELECT minTemp1, maxTemp1, precip1,
        minTemp2, maxTemp2, precip2,
        minTemp3, maxTemp3, precip3,
        minTemp4, maxTemp4, precip4,
        minTemp5, maxTemp5, precip5,
        minTemp6, maxTemp6, precip6,
        minTemp7, maxTemp7, precip7,
        minTemp8, maxTemp8, precip8,
        minTemp9, maxTemp9, precip9,
        minTemp10, maxTemp10, precip10,
        minTemp11, maxTemp11, precip11,
        minTemp12, maxTemp12, precip12 FROM Campground
            WHERE nameID=:nameID
    '''

    result = engine.execute(text(q),nameID=nameID)
    for itemDB in result:
        tempData=[]
        monthArray=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        for indexMonth,month in enumerate(monthArray):
            tempData.append({'MONTH': month, 'min/max':'minT','Temperature (F)': int(itemDB['minTemp'+str(indexMonth+1)]/10)})
            tempData.append({'MONTH': month, 'min/max':'maxT','Temperature (F)': int(itemDB['maxTemp'+str(indexMonth+1)]/10)})
        precipData=[{'MONTH': month, 'Precipitation (in)':itemDB['precip'+str(indexMonth+1)]/100.0 if itemDB['precip'+str(indexMonth+1)]!=-7777 else 0} for indexMonth,month in enumerate(monthArray)]

    return jsonify(
    {'tempData':tempData,'precipData':precipData})



#######Picture Function#########
@application.route('/photos/<string:nameID>')
def photo(nameID=None):
    return send_file('photos/'+nameID+'.jpg',mimetype='image/gif')

@application.route('/blueMarker')
def blueMarker():
#original: http://maps.google.com/mapfiles/ms/icons/blue-dot.png
    return send_file('blue-dot.png',mimetype='image/gif')

@application.route('/greenMarker')
def greenMarker():
#original: http://maps.google.com/mapfiles/ms/icons/green-dot.png
    return send_file('green-dot.png',mimetype='image/gif')

@application.route('/redMarker')
def redMarker():
#original: http://maps.google.com/mapfiles/ms/icons/green-dot.png
    return send_file('red-dot.png',mimetype='image/gif')

@application.route('/greyMarker')
def greyMarker():
#original: http://maps.google.com/mapfiles/ms/icons/green-dot.png
    return send_file('grey-dot.png',mimetype='image/gif')

@application.route('/loading')
def loading():
    return send_file('loading.gif',mimetype='image/gif')

def createTweet(q):
    q=q[:-4]
    with open('twitterCred.txt') as f:
        credDic=json.loads(f.read())

    CONSUMER_KEY = credDic['CONSUMER_KEY']    
    CONSUMER_SECRET = credDic['CONSUMER_SECRET']
    TOKEN = credDic['TOKEN']
    TOKEN_SECRET = credDic['TOKEN_SECRET']
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(TOKEN, TOKEN_SECRET)
    api = tweepy.API(auth)
    #public_tweets = api.search(q=q+' filter:images',count=2)

    #c = tweepy.Cursor(api.search, q=q)
    #for tweet in c.items():
    output=[]
    for tweet in tweepy.Cursor(api.search,
                           q=q+' filter:images',
                           rpp=10,
                           include_entities=True,
                           lang="en").items():
        if 'media' in tweet.entities.keys():
            for url in tweet.entities['media']:
                ex=url['expanded_url']
                if ex not in output:
                    output.append(url['expanded_url'])


    #output=[public_tweets[1]._json['entities']['media'][0]['expanded_url']]
    return output


@application.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404


if __name__ == '__main__':
    application.run()
