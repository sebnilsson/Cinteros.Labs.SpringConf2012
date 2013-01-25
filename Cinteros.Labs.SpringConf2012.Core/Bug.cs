using System.Runtime.Serialization;

namespace Cinteros.Labs.SpringConf2012
{
    [DataContract(Name = "bugReport")]
    public class Bug
    {
        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "hours")]
        public double Hours { get; set; }

        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "priorityIndex")]
        public int PriorityIndex { get; set; }
    }
}