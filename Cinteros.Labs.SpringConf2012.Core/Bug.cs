using System;
using System.Runtime.Serialization;

namespace Cinteros.Labs.SpringConf2012 {
    [DataContract(Name = "bugReport")]
    public class Bug {
        public Bug(BugPriority priority = null) {
            ID = Guid.NewGuid();
            Priority = priority ?? BugPriority.Normal;
        }

        [DataMember(Name = "description")]
        public string Description { get; set; }
        [DataMember(Name = "hours")]
        public double Hours { get; set; }
        public Guid ID { get; private set; }
        [DataMember(Name = "name")]
        public string Name { get; set; }
        [DataMember(Name = "priority")]
        public BugPriority Priority { get; set; }
    }
}
