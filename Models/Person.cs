namespace Resume.Models;

public class Person
{
    public string? FullName { get; set; }
    public string? Position { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public string? Summary { get; set; }
    public List<Skill>? Skills { get; set; }
    public List<Experience>? Experience { get; set; }
}

public class Skill
{
    public int Number { get; set; }
    public string? Name { get; set; }
    public int Level { get; set; } // 0-100%
}

public class Experience
{
    public string? Period { get; set; }
    public string? Position { get; set; }
    public string? Company { get; set; }
    public string? Description { get; set; }
}