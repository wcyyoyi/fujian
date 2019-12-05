package yz.com.meteo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import yz.com.bean.znq.MangStatSet;
import yz.com.models.UrlUser;
import yz.com.resources.database.MangStatSetResource;

@RequestMapping(value = "/stat/set")
@RestController
public class MangStatSetService {

	@Autowired
	private MangStatSetResource mangStatSetResource;

	@RequestMapping(value = "/getByUserId", method = RequestMethod.GET)
	public ResponseEntity<List<MangStatSet>> getByUserId() {

		UrlUser user = (UrlUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return new ResponseEntity<List<MangStatSet>>(mangStatSetResource.getByUserId(user.getId().toString()),
				HttpStatus.OK);

	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	public ResponseEntity<Integer> create(@RequestBody MangStatSet mangStatSet) {

		UrlUser user = (UrlUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		mangStatSet.setcBuscode(user.getId().toString());

		return new ResponseEntity<Integer>(mangStatSetResource.insert(mangStatSet), HttpStatus.OK);

	}

}
