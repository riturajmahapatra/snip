//  talk to DB * FROM 
package com.rituraj.system;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UrlRepository extends JpaRepository<Url, String> {
} //db manager , interface- rules , is file k karan we dont have to do full query in mySql 
