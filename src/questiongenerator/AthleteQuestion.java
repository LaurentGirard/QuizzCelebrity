package questiongenerator;

public class AthleteQuestion extends Question{
	
	public AthleteQuestion(){
		super();
		request = 	"prefix db-owl: <http://dbpedia.org/ontology/>"
					+"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "PREFIX umbel-rc: <http://umbel.org/umbel/rc/>"
					+ "select distinct (str(?name) as ?n) (str(?country) as ?cnt) (str(?birthYear) as ?date) (str(?image) as ?img) where {"
					+ "?actor a umbel-rc:Athlete;"
					+ "foaf:name ?name;"
					+ "foaf:depiction ?image;"
					+ "db-owl:birthPlace ?birthPlace;"
					+ "db-owl:birthYear ?birthYear."
					+ "?birthPlace dbp:commonName ?country."
					+ "FILTER regex(?name, '^((?![éàè,íóć.ùúûüñðáâãý]).)*$')"
					+ "}"
					+ "limit 150"
					+ "offset "
					+ Integer.toString(offset_rand);
	}
}
