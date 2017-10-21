#based on: https://github.com/lobrown/Full-Stack-Foundations/blob/master/Lesson_1/database_setup.py
import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Float

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import relationship

from sqlalchemy import create_engine

Base=declarative_base()


class Campground(Base):
    __tablename__ = 'campground'
    primaryID=Column(Integer,primary_key=True)
    parkID=Column(Integer)
    name=Column(String(100))
    nameID=Column(String(100))
    zipcode=Column(String(100))
    latitude=Column(Integer)
    longitude=Column(Integer)
    ####climate########
    climate=Column(String(100))
    desert=Column(Integer)
    redwood=Column(Integer)
    beach=Column(Integer)
    lake=Column(Integer)
    river=Column(Integer)
    minTemp1=Column(Integer)
    maxTemp1=Column(Integer)
    precip1=Column(Integer)
    minTemp2=Column(Integer)
    maxTemp2=Column(Integer)
    precip2=Column(Integer)
    minTemp3=Column(Integer)
    maxTemp3=Column(Integer)
    precip3=Column(Integer)
    minTemp4=Column(Integer)
    maxTemp4=Column(Integer)
    precip4=Column(Integer)    
    minTemp5=Column(Integer)
    maxTemp5=Column(Integer)
    precip5=Column(Integer)
    minTemp6=Column(Integer)
    maxTemp6=Column(Integer)
    precip6=Column(Integer)
    minTemp7=Column(Integer)
    maxTemp7=Column(Integer)
    precip7=Column(Integer)
    minTemp8=Column(Integer)
    maxTemp8=Column(Integer)
    precip8=Column(Integer)
    minTemp9=Column(Integer)
    maxTemp9=Column(Integer)
    precip9=Column(Integer)
    minTemp10=Column(Integer)
    maxTemp10=Column(Integer)
    precip10=Column(Integer)
    minTemp11=Column(Integer)
    maxTemp11=Column(Integer)
    precip11=Column(Integer)
    minTemp12=Column(Integer)
    maxTemp12=Column(Integer)
    precip12=Column(Integer)
    ########Yelp###################
    yelpID=Column(String(100))
    rating=Column(String(3))
    numReviews=Column(Integer)
    hiddenGem=Column(Integer)
    hotPickRank=Column(Integer)
    hotPickWeekday=Column(Integer)
    ########Booking Difficulty#######
    bookingDifficulty=Column(Integer)


class CampSite(Base):
    __tablename__='campSite'
    campground=relationship(Campground)
    primaryID=Column(Integer,primary_key=True)
    nameID=Column(String(100),ForeignKey('campground.nameID'))
    siteType=Column(String(100))
    ADA=Column(Integer)
    numSites=Column(Integer)
    siteID=Column(Integer)

class CityCA(Base):
    __tablename__ = 'cityCA'
    primaryID=Column(Integer,primary_key=True)
    name=Column(String(100))
    population=Column(Integer)
    latitude=Column(Integer)
    longitude=Column(Integer)

class CampgroundSimilar(Base):
    __tablename__ = 'campgroundSimilar'
    campground=relationship(Campground)
    primaryID=Column(Integer,primary_key=True)
    nameID1=Column(String(100),ForeignKey('campground.nameID'))
    nameID2=Column(String(100))
    figureOfMerit=Column(Integer)

class CampgroundDistance(Base):
    __tablename__ = 'campgroundDistance'
    primaryID=Column(Integer,primary_key=True)
    nameID1=Column(String(100))
    nameID2=Column(String(100))
    distMinute=Column(Integer)
    distHour=Column(Integer)    

class CityDistance(Base):
    __tablename__ = 'cityDistance'
    primaryID=Column(Integer,primary_key=True)
    nameID=Column(String(100))
    city=Column(String(100))
    distMinute=Column(Integer)
    distHour=Column(Integer)
